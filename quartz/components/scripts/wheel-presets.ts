import { readFileSync, readdirSync } from "node:fs"
import { basename, resolve } from "node:path"
import {
  MAX_WHEEL_OPTIONS,
  MIN_WHEEL_OPTIONS,
  type WheelOption,
  type WheelPreset,
} from "./wheel-core"

export const DEFAULT_WHEEL_PRESET_ID = "food"
export const WHEEL_PRESET_DIRECTORY = resolve(process.cwd(), "data", "wheel-presets")

const WHEEL_COLORS = [
  "#e76f51",
  "#2a9d8f",
  "#e9c46a",
  "#457b9d",
  "#f4a261",
  "#6d597a",
  "#84a59d",
  "#d65d7a",
  "#588157",
  "#9b5de5",
  "#00a6a6",
  "#ef8354",
] as const

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function presetError(fileName: string, message: string): never {
  throw new Error(`转盘预设 ${fileName}：${message}`)
}

function fallbackPresetId(fileName: string): string {
  return basename(fileName, ".json").replace(/^\d+[-_.]?/u, "") || "wheel-preset"
}

function getUniqueOptionId(
  candidate: unknown,
  presetId: string,
  index: number,
  usedIds: Set<string>,
): string {
  if (candidate !== undefined && (typeof candidate !== "string" || !candidate.trim())) {
    throw new Error(`第 ${index + 1} 个选项的 id 必须是非空字符串`)
  }

  const base = typeof candidate === "string" ? candidate.trim() : `${presetId}-${index + 1}`
  let id = base
  let suffix = 2

  while (usedIds.has(id)) {
    id = `${base}-${suffix}`
    suffix += 1
  }

  usedIds.add(id)
  return id
}

export function colorForWheelIndex(index: number): string {
  return WHEEL_COLORS[index % WHEEL_COLORS.length]
}

function normalizePresetOption(
  rawOption: unknown,
  presetId: string,
  index: number,
  usedIds: Set<string>,
): WheelOption {
  if (!isRecord(rawOption)) {
    throw new Error(`第 ${index + 1} 个选项必须是对象`)
  }
  if (typeof rawOption.label !== "string" || !rawOption.label.trim()) {
    throw new Error(`第 ${index + 1} 个选项缺少非空 label`)
  }

  const weight = rawOption.weight === undefined ? 1 : rawOption.weight
  if (typeof weight !== "number" || !Number.isFinite(weight) || weight <= 0) {
    throw new Error(`第 ${index + 1} 个选项的 weight 必须是正数`)
  }

  const enabled = rawOption.enabled === undefined ? true : rawOption.enabled
  if (typeof enabled !== "boolean") {
    throw new Error(`第 ${index + 1} 个选项的 enabled 必须是布尔值`)
  }

  const fallbackColor = colorForWheelIndex(index)
  if (
    rawOption.color !== undefined &&
    (typeof rawOption.color !== "string" || !rawOption.color.trim())
  ) {
    throw new Error(`第 ${index + 1} 个选项的 color 必须是非空字符串`)
  }

  return {
    id: getUniqueOptionId(rawOption.id, presetId, index, usedIds),
    label: rawOption.label.trim(),
    weight,
    color: typeof rawOption.color === "string" ? rawOption.color.trim() : fallbackColor,
    enabled,
  }
}

function normalizePreset(rawPreset: unknown, fileName: string): WheelPreset {
  if (!isRecord(rawPreset)) presetError(fileName, "JSON 顶层必须是对象")
  if (rawPreset.schemaVersion !== 1) presetError(fileName, "schemaVersion 必须为 1")
  if (rawPreset.type !== "wheel-preset") presetError(fileName, 'type 必须为 "wheel-preset"')
  if (rawPreset.id !== undefined && (typeof rawPreset.id !== "string" || !rawPreset.id.trim())) {
    presetError(fileName, "id 必须是非空字符串")
  }
  if (typeof rawPreset.name !== "string" || !rawPreset.name.trim()) {
    presetError(fileName, "name 必须是非空字符串")
  }
  if (rawPreset.description !== undefined && typeof rawPreset.description !== "string") {
    presetError(fileName, "description 必须是字符串")
  }
  if (!Array.isArray(rawPreset.options)) presetError(fileName, "options 必须是数组")
  if (
    rawPreset.options.length < MIN_WHEEL_OPTIONS ||
    rawPreset.options.length > MAX_WHEEL_OPTIONS
  ) {
    presetError(
      fileName,
      `options 数量必须为 ${MIN_WHEEL_OPTIONS}～${MAX_WHEEL_OPTIONS}，当前为 ${rawPreset.options.length}`,
    )
  }

  const id = typeof rawPreset.id === "string" ? rawPreset.id.trim() : fallbackPresetId(fileName)
  if (id === "custom") presetError(fileName, 'id "custom" 为系统保留值')

  const usedOptionIds = new Set<string>()
  let options: WheelOption[]
  try {
    options = rawPreset.options.map((option, index) =>
      normalizePresetOption(option, id, index, usedOptionIds),
    )
  } catch (error) {
    presetError(fileName, error instanceof Error ? error.message : "选项格式无效")
  }

  return {
    id,
    name: rawPreset.name.trim(),
    description: rawPreset.description?.trim() ?? "",
    options,
  }
}

/**
 * Reads every JSON file in the preset directory at build time.
 * Adding a valid file is therefore enough to include it in the compiled preset list.
 */
export function loadWheelPresets(directory = WHEEL_PRESET_DIRECTORY): WheelPreset[] {
  let fileNames: string[]
  try {
    fileNames = readdirSync(directory, { withFileTypes: true })
      .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".json"))
      .map((entry) => entry.name)
      .sort((left, right) => left.localeCompare(right, "en"))
  } catch (error) {
    throw new Error(
      `无法读取转盘预设目录 ${directory}：${error instanceof Error ? error.message : "未知错误"}`,
    )
  }

  if (fileNames.length === 0) {
    throw new Error(`转盘预设目录 ${directory} 中没有 JSON 文件`)
  }

  const usedPresetIds = new Set<string>()
  return fileNames.map((fileName) => {
    const filePath = resolve(directory, fileName)
    let rawPreset: unknown

    try {
      const source = readFileSync(filePath, "utf8").replace(/^\uFEFF/u, "")
      rawPreset = JSON.parse(source)
    } catch (error) {
      presetError(fileName, `无法解析 JSON：${error instanceof Error ? error.message : "未知错误"}`)
    }

    const preset = normalizePreset(rawPreset, fileName)
    if (usedPresetIds.has(preset.id)) {
      presetError(fileName, `预设 id "${preset.id}" 重复`)
    }
    usedPresetIds.add(preset.id)
    return preset
  })
}

export const WHEEL_PRESETS: readonly WheelPreset[] = loadWheelPresets()

if (!WHEEL_PRESETS.some((preset) => preset.id === DEFAULT_WHEEL_PRESET_ID)) {
  throw new Error(`转盘预设目录中缺少默认预设 "${DEFAULT_WHEEL_PRESET_ID}"`)
}

export function getWheelPreset(id: string): WheelPreset | undefined {
  return WHEEL_PRESETS.find((preset) => preset.id === id)
}

export function cloneWheelOptions(options: readonly WheelOption[]): WheelOption[] {
  return options.map((option) => ({ ...option }))
}

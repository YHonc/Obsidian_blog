export const MIN_WHEEL_OPTIONS = 2
export const MAX_WHEEL_OPTIONS = 150
export const NUMBER_MODE_THRESHOLD = 30
export const COLOR_ONLY_MODE_THRESHOLD = 51
export const WHEEL_STORAGE_KEY = "quartz-wheel-config-v1"

export interface WheelOption {
  id: string
  label: string
  weight?: number
  color?: string
  enabled?: boolean
}

export interface WheelPreset {
  id: string
  name: string
  description?: string
  options: readonly WheelOption[]
}

export interface WheelResult {
  index: number
  option: WheelOption
}

export interface WheelState {
  wheelId: string
  wheelName: string
  description: string
  options: WheelOption[]
  selectedPresetId: string
  selectedIndex: number | null
  currentRotation: number
  isSpinning: boolean
}

export interface StoredWheelConfig {
  version: 1
  wheelId: string
  wheelName: string
  description?: string
  selectedPresetId: string
  options: WheelOption[]
}

export interface WheelImportOption {
  id?: string
  label: string
  weight?: number
  color?: string
  enabled?: boolean
}

export interface WheelImportFile {
  schemaVersion: 1
  type: "wheel-preset"
  id?: string
  name: string
  description?: string
  options: WheelImportOption[]
}

export interface NormalizedWheelImport {
  schemaVersion: 1
  type: "wheel-preset"
  id: string
  name: string
  description: string
  options: WheelOption[]
}

interface OptionFactoryDependencies {
  createId: () => string
  colorForIndex: (index: number) => string
}

interface ImportDependencies extends OptionFactoryDependencies {
  isColorSupported: (color: string) => boolean
}

type Uint32Source = () => number

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function getUniqueId(candidate: unknown, usedIds: Set<string>, createId: () => string): string {
  const requested = typeof candidate === "string" ? candidate.trim() : ""
  let base = requested

  if (!base) {
    do {
      base = createId()
    } while (!base || usedIds.has(base))
  }

  if (!usedIds.has(base)) {
    usedIds.add(base)
    return base
  }

  let suffix = 2
  let resolved = `${base}-${suffix}`
  while (usedIds.has(resolved)) {
    suffix += 1
    resolved = `${base}-${suffix}`
  }

  usedIds.add(resolved)
  return resolved
}

export function getEnabledOptions(options: readonly WheelOption[]): WheelOption[] {
  return options.filter((option) => option.enabled !== false)
}

export function disableWheelOption(
  options: readonly WheelOption[],
  selectedId: string,
): WheelOption[] {
  let found = false
  const nextOptions = options.map((option) => {
    if (option.id !== selectedId) return { ...option }

    found = true
    return { ...option, enabled: false }
  })

  if (!found) {
    throw new Error("未找到需要停用的选项")
  }

  return nextOptions
}

export function assertValidOptionCount(options: readonly WheelOption[]): void {
  const enabledCount = getEnabledOptions(options).length

  if (enabledCount < MIN_WHEEL_OPTIONS) {
    throw new Error(`至少需要 ${MIN_WHEEL_OPTIONS} 个有效选项`)
  }

  if (enabledCount > MAX_WHEEL_OPTIONS) {
    throw new Error(`最多允许 ${MAX_WHEEL_OPTIONS} 个有效选项`)
  }
}

export function parsePlainTextLabels(text: string): string[] {
  return text
    .split(/\r?\n/u)
    .map((label) => label.trim())
    .filter(Boolean)
}

export function createOptionsFromText(
  text: string,
  dependencies: OptionFactoryDependencies,
): WheelOption[] {
  const labels = parsePlainTextLabels(text)

  if (labels.length < MIN_WHEEL_OPTIONS) {
    throw new Error(`至少需要 ${MIN_WHEEL_OPTIONS} 个非空选项`)
  }

  if (labels.length > MAX_WHEEL_OPTIONS) {
    throw new Error(`最多允许 ${MAX_WHEEL_OPTIONS} 个选项，当前为 ${labels.length} 个`)
  }

  const usedIds = new Set<string>()
  return labels.map((label, index) => ({
    id: getUniqueId(undefined, usedIds, dependencies.createId),
    label,
    weight: 1,
    color: dependencies.colorForIndex(index),
    enabled: true,
  }))
}

export function getWheelDisplayLabel(option: WheelOption, index: number, total: number): string {
  if (total >= COLOR_ONLY_MODE_THRESHOLD) return ""
  return total >= NUMBER_MODE_THRESHOLD ? String(index + 1) : option.label
}

export function formatWheelResult(result: WheelResult, total: number): string {
  if (total >= COLOR_ONLY_MODE_THRESHOLD) return result.option.label
  return total >= NUMBER_MODE_THRESHOLD
    ? `${result.index + 1}. ${result.option.label}`
    : result.option.label
}

export function normalizeDegrees(angle: number): number {
  return ((angle % 360) + 360) % 360
}

/**
 * Sector zero is drawn with its centre under the top pointer. Positive CSS rotation is clockwise.
 */
export function calculateTargetRotation(
  selectedIndex: number,
  total: number,
  currentRotation: number,
  extraTurns: number,
): number {
  if (!Number.isInteger(total) || total <= 0) {
    throw new Error("选项数量必须是正整数")
  }
  if (!Number.isInteger(selectedIndex) || selectedIndex < 0 || selectedIndex >= total) {
    throw new Error("选中的索引超出范围")
  }
  if (!Number.isFinite(currentRotation)) {
    throw new Error("当前旋转角度无效")
  }
  if (!Number.isInteger(extraTurns) || extraTurns < 0) {
    throw new Error("完整旋转圈数必须是非负整数")
  }

  const sectorAngle = 360 / total
  const desiredRotation = normalizeDegrees(-selectedIndex * sectorAngle)
  const delta = normalizeDegrees(desiredRotation - normalizeDegrees(currentRotation))

  return currentRotation + extraTurns * 360 + delta
}

/** Returns the sector centred under the top pointer for a calibrated rotation. */
export function getSelectedIndexForRotation(rotation: number, total: number): number {
  if (!Number.isInteger(total) || total <= 0) {
    throw new Error("选项数量必须是正整数")
  }

  const sectorAngle = 360 / total
  return Math.round(normalizeDegrees(-rotation) / sectorAngle) % total
}

function browserRandomUint32(): number {
  if (!globalThis.crypto?.getRandomValues) {
    throw new Error("当前浏览器不支持安全随机数生成")
  }

  const values = new Uint32Array(1)
  globalThis.crypto.getRandomValues(values)
  return values[0]
}

/** Uses rejection sampling so modulo reduction cannot bias the selected index. */
export function secureRandomIndex(
  length: number,
  source: Uint32Source = browserRandomUint32,
): number {
  if (!Number.isInteger(length) || length <= 0) {
    throw new Error("选项数量必须是正整数")
  }

  const uint32Range = 0x100000000
  const limit = uint32Range - (uint32Range % length)
  let value = source()

  while (!Number.isInteger(value) || value < 0 || value >= uint32Range || value >= limit) {
    value = source()
  }

  return value % length
}

function normalizeOption(
  rawOption: unknown,
  index: number,
  usedIds: Set<string>,
  dependencies: ImportDependencies,
): WheelOption | null {
  if (!isRecord(rawOption)) {
    throw new Error(`第 ${index + 1} 个选项必须是对象`)
  }

  if (typeof rawOption.label !== "string") {
    throw new Error(`第 ${index + 1} 个选项缺少有效的 label`)
  }

  const label = rawOption.label.trim()
  if (!label) return null

  const weight = rawOption.weight ?? 1
  if (typeof weight !== "number" || !Number.isFinite(weight) || weight <= 0) {
    throw new Error(`第 ${index + 1} 个选项的 weight 必须是正数`)
  }

  const enabled = rawOption.enabled ?? true
  if (typeof enabled !== "boolean") {
    throw new Error(`第 ${index + 1} 个选项的 enabled 必须是布尔值`)
  }

  let color = dependencies.colorForIndex(index)
  if (rawOption.color !== undefined) {
    if (typeof rawOption.color !== "string" || !rawOption.color.trim()) {
      throw new Error(`第 ${index + 1} 个选项的 color 必须是非空颜色字符串`)
    }
    color = rawOption.color.trim()
    if (!dependencies.isColorSupported(color)) {
      throw new Error(`第 ${index + 1} 个选项的颜色“${color}”无法识别`)
    }
  }

  return {
    id: getUniqueId(rawOption.id, usedIds, dependencies.createId),
    label,
    weight,
    color,
    enabled,
  }
}

function normalizeOptions(rawOptions: unknown[], dependencies: ImportDependencies): WheelOption[] {
  const usedIds = new Set<string>()
  const options: WheelOption[] = []

  for (const [index, rawOption] of rawOptions.entries()) {
    const option = normalizeOption(rawOption, index, usedIds, dependencies)
    if (option) options.push(option)
  }

  if (options.length < MIN_WHEEL_OPTIONS) {
    throw new Error(`至少需要 ${MIN_WHEEL_OPTIONS} 个非空选项`)
  }

  if (options.length > MAX_WHEEL_OPTIONS) {
    throw new Error(`最多允许 ${MAX_WHEEL_OPTIONS} 个选项，当前为 ${options.length} 个`)
  }

  return options
}

export function normalizeWheelImport(
  input: unknown,
  dependencies: ImportDependencies,
): NormalizedWheelImport {
  if (!isRecord(input)) {
    throw new Error("JSON 顶层必须是对象")
  }
  if (input.schemaVersion !== 1) {
    throw new Error("仅支持 schemaVersion 为 1 的转盘配置")
  }
  if (input.type !== "wheel-preset") {
    throw new Error('type 必须是 "wheel-preset"')
  }
  if (typeof input.name !== "string" || !input.name.trim()) {
    throw new Error("name 必须是非空字符串")
  }
  if (input.description !== undefined && typeof input.description !== "string") {
    throw new Error("description 必须是字符串")
  }
  if (!Array.isArray(input.options)) {
    throw new Error("options 必须是数组")
  }

  return {
    schemaVersion: 1,
    type: "wheel-preset",
    id: typeof input.id === "string" && input.id.trim() ? input.id.trim() : dependencies.createId(),
    name: input.name.trim(),
    description: input.description?.trim() ?? "",
    options: normalizeOptions(input.options, dependencies),
  }
}

export function normalizeStoredConfig(
  input: unknown,
  dependencies: ImportDependencies,
): StoredWheelConfig {
  if (!isRecord(input) || input.version !== 1) {
    throw new Error("本地配置版本无效")
  }
  if (typeof input.wheelName !== "string" || !input.wheelName.trim()) {
    throw new Error("本地配置缺少转盘名称")
  }
  if (typeof input.selectedPresetId !== "string" || !input.selectedPresetId.trim()) {
    throw new Error("本地配置缺少预设标识")
  }
  if (!Array.isArray(input.options)) {
    throw new Error("本地配置的 options 必须是数组")
  }

  const normalized = normalizeWheelImport(
    {
      schemaVersion: 1,
      type: "wheel-preset",
      id: input.wheelId,
      name: input.wheelName,
      description: input.description,
      options: input.options,
    },
    dependencies,
  )

  return {
    version: 1,
    wheelId: normalized.id,
    wheelName: normalized.name,
    description: normalized.description,
    selectedPresetId: input.selectedPresetId.trim(),
    options: normalized.options,
  }
}

export function createWheelExport(state: WheelState): WheelImportFile {
  return {
    schemaVersion: 1,
    type: "wheel-preset",
    id: state.wheelId,
    name: state.wheelName.trim() || "随机转盘",
    ...(state.description ? { description: state.description } : {}),
    options: state.options.map((option) => ({
      id: option.id,
      label: option.label,
      weight: option.weight ?? 1,
      color: option.color,
      enabled: option.enabled !== false,
    })),
  }
}

import assert from "node:assert/strict"
import { mkdtempSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import test from "node:test"
import {
  getWheelPreset,
  loadWheelPresets,
  WHEEL_PRESETS,
  WHEEL_PRESET_DIRECTORY,
} from "./wheel-presets"

test("all preset JSON files are discovered in deterministic order", () => {
  assert.equal(WHEEL_PRESET_DIRECTORY.endsWith(join("data", "wheel-presets")), true)
  assert.deepEqual(
    WHEEL_PRESETS.map((preset) => preset.id),
    ["food", "weekend", "task", "kiss-hundred", "love-hundred"],
  )
})

test("romance presets are deduplicated and retain their requested names", () => {
  const kissPreset = getWheelPreset("kiss-hundred")
  const lovePreset = getWheelPreset("love-hundred")

  assert.ok(kissPreset)
  assert.ok(lovePreset)
  assert.equal(kissPreset.name, "吻的一百种")
  assert.equal(lovePreset.name, "爱的一百种")
  assert.equal(kissPreset.options.length, 96)
  assert.equal(lovePreset.options.length, 53)

  for (const preset of [kissPreset, lovePreset]) {
    const normalizedLabels = preset.options.map((option) => option.label.normalize("NFKC").trim())
    assert.equal(new Set(normalizedLabels).size, normalizedLabels.length)
  }
})

test("dropping a standard JSON file into a directory automatically creates a preset", () => {
  const directory = mkdtempSync(join(tmpdir(), "wheel-presets-"))

  try {
    writeFileSync(
      join(directory, "06-bonus.json"),
      JSON.stringify({
        schemaVersion: 1,
        type: "wheel-preset",
        name: "临时预设",
        options: [{ label: " A " }, { label: "B", weight: 2, enabled: false }],
      }),
      "utf8",
    )

    const presets = loadWheelPresets(directory)
    assert.equal(presets.length, 1)
    assert.equal(presets[0].id, "bonus")
    assert.equal(presets[0].name, "临时预设")
    assert.deepEqual(
      presets[0].options.map((option) => option.label),
      ["A", "B"],
    )
    assert.equal(presets[0].options[0].weight, 1)
    assert.equal(presets[0].options[0].enabled, true)
    assert.equal(presets[0].options[1].weight, 2)
    assert.equal(presets[0].options[1].enabled, false)
  } finally {
    rmSync(directory, { recursive: true, force: true })
  }
})

test("invalid preset JSON fails with the source file name", () => {
  const directory = mkdtempSync(join(tmpdir(), "wheel-presets-invalid-"))

  try {
    writeFileSync(
      join(directory, "broken.json"),
      JSON.stringify({
        schemaVersion: 2,
        type: "wheel-preset",
        name: "无效预设",
        options: [{ label: "A" }, { label: "B" }],
      }),
      "utf8",
    )

    assert.throws(() => loadWheelPresets(directory), /broken\.json.*schemaVersion/u)
  } finally {
    rmSync(directory, { recursive: true, force: true })
  }
})

test("the removed study preset is no longer available", () => {
  assert.equal(getWheelPreset("study"), undefined)
})

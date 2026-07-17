import assert from "node:assert/strict"
import test from "node:test"
import kissOptions from "./presets/kiss-options.json"
import loveOptions from "./presets/love-options.json"
import { getWheelPreset, WHEEL_PRESETS } from "./wheel-presets"

test("romance presets preserve their source option order and counts", () => {
  const kissPreset = getWheelPreset("kiss-hundred")
  const lovePreset = getWheelPreset("love-hundred")

  assert.ok(kissPreset)
  assert.ok(lovePreset)
  assert.equal(kissPreset.name, "吻的一百种")
  assert.equal(lovePreset.name, "爱的一百种")
  assert.deepEqual(
    kissPreset.options.map((option) => option.label),
    kissOptions,
  )
  assert.deepEqual(
    lovePreset.options.map((option) => option.label),
    loveOptions,
  )
  assert.equal(kissPreset.options.length, 107)
  assert.equal(lovePreset.options.length, 53)
})

test("the removed study preset is no longer available", () => {
  assert.equal(getWheelPreset("study"), undefined)
  assert.equal(
    WHEEL_PRESETS.some((preset) => preset.name === "今天学什么"),
    false,
  )
})

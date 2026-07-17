import assert from "node:assert/strict"
import test from "node:test"
import {
  COLOR_ONLY_MODE_THRESHOLD,
  MAX_WHEEL_OPTIONS,
  NUMBER_MODE_THRESHOLD,
  calculateTargetRotation,
  createOptionsFromText,
  createWheelExport,
  disableWheelOption,
  formatWheelResult,
  getEnabledOptions,
  getSelectedIndexForRotation,
  getWheelDisplayLabel,
  normalizeStoredConfig,
  normalizeWheelImport,
  secureRandomIndex,
  type WheelOption,
  type WheelState,
} from "./wheel-core"

const idFactory = (() => {
  let next = 0
  return () => `generated-${++next}`
})()

const dependencies = {
  createId: idFactory,
  colorForIndex: (index: number) => `#00000${index % 10}`,
  isColorSupported: (color: string) => /^#[0-9a-f]{6}$/iu.test(color),
}

test("text, number, and color-only modes switch at 30 and 51 options", () => {
  const option: WheelOption = { id: "a", label: "完整名称" }

  assert.equal(COLOR_ONLY_MODE_THRESHOLD, 51)
  assert.equal(NUMBER_MODE_THRESHOLD, 30)
  assert.equal(getWheelDisplayLabel(option, 28, 29), "完整名称")
  assert.equal(getWheelDisplayLabel(option, 29, 30), "30")
  assert.equal(getWheelDisplayLabel(option, 49, 50), "50")
  assert.equal(getWheelDisplayLabel(option, 50, 51), "")
  assert.equal(formatWheelResult({ index: 28, option }, 29), "完整名称")
  assert.equal(formatWheelResult({ index: 29, option }, 30), "30. 完整名称")
  assert.equal(formatWheelResult({ index: 49, option }, 50), "50. 完整名称")
  assert.equal(formatWheelResult({ index: 50, option }, 51), "完整名称")
})

test("target rotations calibrate every sector in a four-option wheel", () => {
  for (let selectedIndex = 0; selectedIndex < 4; selectedIndex += 1) {
    const rotation = calculateTargetRotation(selectedIndex, 4, 37, 5)
    assert.equal(getSelectedIndexForRotation(rotation, 4), selectedIndex)
    assert.ok(rotation >= 37 + 5 * 360)
  }
})

test("target rotation stays aligned at boundary counts and selected indexes", () => {
  const totals = [2, 4, 6, 12, 29, 30, 31, 50, 51, 150]

  for (const total of totals) {
    const indexes = new Set([0, Math.min(14, total - 1), Math.min(28, total - 1), total - 1])
    for (const selectedIndex of indexes) {
      const rotation = calculateTargetRotation(selectedIndex, total, 271.25, 7)
      assert.equal(getSelectedIndexForRotation(rotation, total), selectedIndex)
    }
  }
})

test("secure random selection rejects out-of-range tail values before modulo", () => {
  const values = [0xffffffff, 7]
  let calls = 0
  const index = secureRandomIndex(10, () => {
    calls += 1
    return values.shift() ?? 0
  })

  assert.equal(index, 7)
  assert.equal(calls, 2)
})

test("plain text input trims blanks, preserves duplicate and HTML-like labels, and assigns IDs", () => {
  const options = createOptionsFromText(
    "  火锅  \n\n火锅\n<script>alert(1)</script>\nlong English option",
    {
      createId: idFactory,
      colorForIndex: (index) => `color-${index}`,
    },
  )

  assert.deepEqual(
    options.map((option) => option.label),
    ["火锅", "火锅", "<script>alert(1)</script>", "long English option"],
  )
  assert.equal(new Set(options.map((option) => option.id)).size, options.length)
})

test("disabling a selected option uses its ID and preserves duplicate labels", () => {
  const options: WheelOption[] = [
    { id: "first", label: "重复选项", enabled: true },
    { id: "second", label: "重复选项", enabled: true },
    { id: "third", label: "其他选项", enabled: true },
  ]

  const updated = disableWheelOption(options, "second")

  assert.notEqual(updated, options)
  assert.equal(options[1].enabled, true)
  assert.equal(updated[0].enabled, true)
  assert.equal(updated[1].enabled, false)
  assert.deepEqual(
    getEnabledOptions(updated).map((option) => option.id),
    ["first", "third"],
  )
  assert.throws(() => disableWheelOption(options, "missing"), /未找到/u)
})

test("plain text input accepts 150 options and rejects 151", () => {
  const maximum = Array.from({ length: MAX_WHEEL_OPTIONS }, (_, index) => `选项 ${index + 1}`).join(
    "\n",
  )
  assert.equal(createOptionsFromText(maximum, dependencies).length, 150)
  assert.throws(
    () => createOptionsFromText(`${maximum}\n选项 151`, dependencies),
    /最多允许 150 个选项/u,
  )
})

test("plain text input rejects fewer than two valid options", () => {
  assert.throws(() => createOptionsFromText("only one\n\n", dependencies))
})

test("JSON export emits the versioned schema and preserves option metadata", () => {
  const serialized = JSON.parse(
    JSON.stringify(
      createWheelExport({
        wheelId: "custom-wheel",
        wheelName: "  Export test  ",
        description: "portable preset",
        options: [
          { id: "a", label: "Alpha", weight: 2, color: "#123456", enabled: true },
          { id: "b", label: "Beta", enabled: false },
          { id: "c", label: "Gamma", enabled: true },
        ],
        selectedPresetId: "custom",
        selectedIndex: 0,
        currentRotation: 720,
        isSpinning: false,
      } satisfies WheelState),
    ),
  )

  assert.deepEqual(serialized, {
    schemaVersion: 1,
    type: "wheel-preset",
    id: "custom-wheel",
    name: "Export test",
    description: "portable preset",
    options: [
      { id: "a", label: "Alpha", weight: 2, color: "#123456", enabled: true },
      { id: "b", label: "Beta", weight: 1, enabled: false },
      { id: "c", label: "Gamma", weight: 1, enabled: true },
    ],
  })

  const restored = normalizeWheelImport(serialized, dependencies)
  assert.deepEqual(
    restored.options.map((option) => option.label),
    ["Alpha", "Beta", "Gamma"],
  )
  assert.equal(restored.options[1].enabled, false)
})

test("JSON import normalizes blanks, defaults metadata, and resolves duplicate IDs", () => {
  const imported = normalizeWheelImport(
    {
      schemaVersion: 1,
      type: "wheel-preset",
      name: "  测试转盘  ",
      options: [
        { id: "same", label: " A " },
        { id: "same", label: "B", weight: 2, enabled: false, color: "#123456" },
        { label: "   " },
        { label: "<b>C</b>" },
      ],
    },
    dependencies,
  )

  assert.equal(imported.name, "测试转盘")
  assert.deepEqual(
    imported.options.map((option) => option.label),
    ["A", "B", "<b>C</b>"],
  )
  assert.equal(new Set(imported.options.map((option) => option.id)).size, 3)
  assert.equal(imported.options[0].weight, 1)
  assert.equal(imported.options[0].enabled, true)
  assert.equal(imported.options[1].enabled, false)
})

test("JSON import rejects incompatible schema but preserves disabled and exhausted states", () => {
  assert.throws(
    () =>
      normalizeWheelImport(
        { schemaVersion: 2, type: "wheel-preset", name: "x", options: [] },
        dependencies,
      ),
    /schemaVersion/u,
  )

  const partiallyDisabled = normalizeWheelImport(
    {
      schemaVersion: 1,
      type: "wheel-preset",
      name: "x",
      options: [{ label: "active" }, { label: "disabled", enabled: false }],
    },
    dependencies,
  )
  assert.equal(getEnabledOptions(partiallyDisabled.options).length, 1)

  const exhausted = normalizeWheelImport(
    {
      schemaVersion: 1,
      type: "wheel-preset",
      name: "exhausted",
      options: [
        { label: "A", enabled: false },
        { label: "B", enabled: false },
      ],
    },
    dependencies,
  )
  assert.equal(getEnabledOptions(exhausted.options).length, 0)
})

test("stored config rejects old, incomplete, and out-of-range data", () => {
  const twoOptions = [{ label: "A" }, { label: "B" }]
  const common = { wheelName: "saved", selectedPresetId: "custom" }
  const invalidConfigs: unknown[] = [
    null,
    { version: 0, ...common, options: twoOptions },
    { version: 1, selectedPresetId: "custom", options: twoOptions },
    { version: 1, ...common, options: "not-an-array" },
    { version: 1, ...common, options: [{ label: "only one" }] },
    {
      version: 1,
      ...common,
      options: Array.from({ length: 151 }, (_, index) => ({ label: `Option ${index + 1}` })),
    },
  ]

  for (const input of invalidConfigs) {
    assert.throws(() => normalizeStoredConfig(input, dependencies))
  }
})

test("stored config accepts a fully exhausted wheel so no-repeat state survives reload", () => {
  const restored = normalizeStoredConfig(
    {
      version: 1,
      wheelId: "saved-wheel",
      wheelName: "saved",
      selectedPresetId: "custom",
      options: [
        { id: "a", label: "A", enabled: false },
        { id: "b", label: "B", enabled: false },
      ],
    },
    dependencies,
  )

  assert.equal(getEnabledOptions(restored.options).length, 0)
  assert.equal(restored.options.length, 2)
})

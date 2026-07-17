import kissOptions from "./presets/kiss-options.json"
import loveOptions from "./presets/love-options.json"
import type { WheelOption, WheelPreset } from "./wheel-core"

export const DEFAULT_WHEEL_PRESET_ID = "food"

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

export function colorForWheelIndex(index: number): string {
  return WHEEL_COLORS[index % WHEEL_COLORS.length]
}

function createPresetOptions(prefix: string, labels: readonly string[]): WheelOption[] {
  return labels.map((label, index) => ({
    id: `${prefix}-${index + 1}`,
    label,
    weight: 1,
    color: colorForWheelIndex(index),
    enabled: true,
  }))
}

export const WHEEL_PRESETS: readonly WheelPreset[] = [
  {
    id: "food",
    name: "今天吃什么",
    description: "随机选择今天的餐饮类型",
    options: createPresetOptions("food", ["火锅", "烧烤", "炒菜", "面食", "麻辣烫", "汉堡"]),
  },
  {
    id: "weekend",
    name: "周末做什么",
    description: "为周末安排一点随机灵感",
    options: createPresetOptions("weekend", ["看电影", "爬山", "逛街", "看书", "打游戏", "休息"]),
  },
  {
    id: "task",
    name: "随机任务",
    description: "从常见任务中随机挑选下一件事",
    options: createPresetOptions("task", [
      "整理笔记",
      "写代码",
      "复习课程",
      "阅读文档",
      "运动",
      "休息",
    ]),
  },
  {
    id: "kiss-hundred",
    name: "吻的一百种",
    description: "随机选择一种亲吻方式",
    options: createPresetOptions("kiss-hundred", kissOptions),
  },
  {
    id: "love-hundred",
    name: "爱的一百种",
    description: "随机选择一种亲密互动",
    options: createPresetOptions("love-hundred", loveOptions),
  },
]

export function getWheelPreset(id: string): WheelPreset | undefined {
  return WHEEL_PRESETS.find((preset) => preset.id === id)
}

export function cloneWheelOptions(options: readonly WheelOption[]): WheelOption[] {
  return options.map((option) => ({ ...option }))
}

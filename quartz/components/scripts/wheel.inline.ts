// @ts-nocheck -- standalone inline runtime recovered from the verified production bundle.
var B = "quartz-wheel-config-v1"
function ge(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e)
}
function lt(e, r, s) {
  let a = typeof e == "string" ? e.trim() : ""
  if (!a)
    do a = s()
    while (!a || r.has(a))
  if (!r.has(a)) return (r.add(a), a)
  let p = 2,
    y = `${a}-${p}`
  for (; r.has(y); ) ((p += 1), (y = `${a}-${p}`))
  return (r.add(y), y)
}
function at(e) {
  return e.filter((r) => r.enabled !== !1)
}
function ct(e, r) {
  let s = !1,
    c = e.map((a) => (a.id !== r ? { ...a } : ((s = !0), { ...a, enabled: !1 })))
  if (!s) throw new Error("\u672A\u627E\u5230\u9700\u8981\u505C\u7528\u7684\u9009\u9879")
  return c
}
function we(e) {
  return e
    .split(/\r?\n/u)
    .map((r) => r.trim())
    .filter(Boolean)
}
function dt(e, r) {
  let s = we(e)
  if (s.length < 2) throw new Error("\u81F3\u5C11\u9700\u8981 2 \u4E2A\u975E\u7A7A\u9009\u9879")
  if (s.length > 150)
    throw new Error(
      `\u6700\u591A\u5141\u8BB8 150 \u4E2A\u9009\u9879\uFF0C\u5F53\u524D\u4E3A ${s.length} \u4E2A`,
    )
  let c = new Set()
  return s.map((a, p) => ({
    id: lt(void 0, c, r.createId),
    label: a,
    weight: 1,
    color: r.colorForIndex(p),
    enabled: !0,
  }))
}
function ut(e, r, s) {
  return s >= 51 ? "" : s >= 30 ? String(r + 1) : e.label
}
function mt(e, r) {
  return r >= 51 ? e.option.label : r >= 30 ? `${e.index + 1}. ${e.option.label}` : e.option.label
}
function F(e) {
  return ((e % 360) + 360) % 360
}
function ht(e, r, s, c) {
  if (!Number.isInteger(r) || r <= 0)
    throw new Error("\u9009\u9879\u6570\u91CF\u5FC5\u987B\u662F\u6B63\u6574\u6570")
  if (!Number.isInteger(e) || e < 0 || e >= r)
    throw new Error("\u9009\u4E2D\u7684\u7D22\u5F15\u8D85\u51FA\u8303\u56F4")
  if (!Number.isFinite(s)) throw new Error("\u5F53\u524D\u65CB\u8F6C\u89D2\u5EA6\u65E0\u6548")
  if (!Number.isInteger(c) || c < 0)
    throw new Error(
      "\u5B8C\u6574\u65CB\u8F6C\u5708\u6570\u5FC5\u987B\u662F\u975E\u8D1F\u6574\u6570",
    )
  let a = 360 / r,
    p = F(-e * a),
    y = F(p - F(s))
  return s + c * 360 + y
}
function cn() {
  if (!globalThis.crypto?.getRandomValues)
    throw new Error(
      "\u5F53\u524D\u6D4F\u89C8\u5668\u4E0D\u652F\u6301\u5B89\u5168\u968F\u673A\u6570\u751F\u6210",
    )
  let e = new Uint32Array(1)
  return (globalThis.crypto.getRandomValues(e), e[0])
}
function $(e, r = cn) {
  if (!Number.isInteger(e) || e <= 0)
    throw new Error("\u9009\u9879\u6570\u91CF\u5FC5\u987B\u662F\u6B63\u6574\u6570")
  let s = 4294967296,
    c = s - (s % e),
    a = r()
  for (; !Number.isInteger(a) || a < 0 || a >= s || a >= c; ) a = r()
  return a % e
}
function dn(e, r, s, c) {
  if (!ge(e)) throw new Error(`\u7B2C ${r + 1} \u4E2A\u9009\u9879\u5FC5\u987B\u662F\u5BF9\u8C61`)
  if (typeof e.label != "string")
    throw new Error(`\u7B2C ${r + 1} \u4E2A\u9009\u9879\u7F3A\u5C11\u6709\u6548\u7684 label`)
  let a = e.label.trim()
  if (!a) return null
  let p = e.weight ?? 1
  if (typeof p != "number" || !Number.isFinite(p) || p <= 0)
    throw new Error(
      `\u7B2C ${r + 1} \u4E2A\u9009\u9879\u7684 weight \u5FC5\u987B\u662F\u6B63\u6570`,
    )
  let y = e.enabled ?? !0
  if (typeof y != "boolean")
    throw new Error(
      `\u7B2C ${r + 1} \u4E2A\u9009\u9879\u7684 enabled \u5FC5\u987B\u662F\u5E03\u5C14\u503C`,
    )
  let O = c.colorForIndex(r)
  if (e.color !== void 0) {
    if (typeof e.color != "string" || !e.color.trim())
      throw new Error(
        `\u7B2C ${r + 1} \u4E2A\u9009\u9879\u7684 color \u5FC5\u987B\u662F\u975E\u7A7A\u989C\u8272\u5B57\u7B26\u4E32`,
      )
    if (((O = e.color.trim()), !c.isColorSupported(O)))
      throw new Error(
        `\u7B2C ${r + 1} \u4E2A\u9009\u9879\u7684\u989C\u8272\u201C${O}\u201D\u65E0\u6CD5\u8BC6\u522B`,
      )
  }
  return { id: lt(e.id, s, c.createId), label: a, weight: p, color: O, enabled: y }
}
function un(e, r) {
  let s = new Set(),
    c = []
  for (let [a, p] of e.entries()) {
    let y = dn(p, a, s, r)
    y && c.push(y)
  }
  if (c.length < 2) throw new Error("\u81F3\u5C11\u9700\u8981 2 \u4E2A\u975E\u7A7A\u9009\u9879")
  if (c.length > 150)
    throw new Error(
      `\u6700\u591A\u5141\u8BB8 150 \u4E2A\u9009\u9879\uFF0C\u5F53\u524D\u4E3A ${c.length} \u4E2A`,
    )
  return c
}
function Ee(e, r) {
  if (!ge(e)) throw new Error("JSON \u9876\u5C42\u5FC5\u987B\u662F\u5BF9\u8C61")
  if (e.schemaVersion !== 1)
    throw new Error("\u4EC5\u652F\u6301 schemaVersion \u4E3A 1 \u7684\u8F6C\u76D8\u914D\u7F6E")
  if (e.type !== "wheel-preset") throw new Error('type \u5FC5\u987B\u662F "wheel-preset"')
  if (typeof e.name != "string" || !e.name.trim())
    throw new Error("name \u5FC5\u987B\u662F\u975E\u7A7A\u5B57\u7B26\u4E32")
  if (e.description !== void 0 && typeof e.description != "string")
    throw new Error("description \u5FC5\u987B\u662F\u5B57\u7B26\u4E32")
  if (!Array.isArray(e.options)) throw new Error("options \u5FC5\u987B\u662F\u6570\u7EC4")
  return {
    schemaVersion: 1,
    type: "wheel-preset",
    id: typeof e.id == "string" && e.id.trim() ? e.id.trim() : r.createId(),
    name: e.name.trim(),
    description: e.description?.trim() ?? "",
    options: un(e.options, r),
  }
}
function pt(e, r) {
  if (!ge(e) || e.version !== 1) throw new Error("\u672C\u5730\u914D\u7F6E\u7248\u672C\u65E0\u6548")
  if (typeof e.wheelName != "string" || !e.wheelName.trim())
    throw new Error("\u672C\u5730\u914D\u7F6E\u7F3A\u5C11\u8F6C\u76D8\u540D\u79F0")
  if (typeof e.selectedPresetId != "string" || !e.selectedPresetId.trim())
    throw new Error("\u672C\u5730\u914D\u7F6E\u7F3A\u5C11\u9884\u8BBE\u6807\u8BC6")
  if (!Array.isArray(e.options))
    throw new Error("\u672C\u5730\u914D\u7F6E\u7684 options \u5FC5\u987B\u662F\u6570\u7EC4")
  let s = Ee(
    {
      schemaVersion: 1,
      type: "wheel-preset",
      id: e.wheelId,
      name: e.wheelName,
      description: e.description,
      options: e.options,
    },
    r,
  )
  return {
    version: 1,
    wheelId: s.id,
    wheelName: s.name,
    description: s.description,
    selectedPresetId: e.selectedPresetId.trim(),
    options: s.options,
  }
}
function ft(e) {
  return {
    schemaVersion: 1,
    type: "wheel-preset",
    id: e.wheelId,
    name: e.wheelName.trim() || "\u968F\u673A\u8F6C\u76D8",
    ...(e.description ? { description: e.description } : {}),
    options: e.options.map((r) => ({
      id: r.id,
      label: r.label,
      weight: r.weight ?? 1,
      color: r.color,
      enabled: r.enabled !== !1,
    })),
  }
}
var gt = [
  "\u820C\u543B",
  "\u5438\u543B",
  "\u54AC\u543B",
  "\u8214\u543B",
  "\u6DF1\u543B",
  "\u62E5\u62B1\u543B",
  "\u665A\u5B89\u543B",
  "\u5589\u7ED3\u543B",
  "\u624B\u543B",
  "\u9F3B\u5C16\u543B",
  "\u773C\u76AE\u543B",
  "\u6E7F\u543B",
  "\u5355\u4FA7\u543B",
  "\u8774\u8776\u543B",
  "\u54AC\u5507\u543B",
  "\u6E38\u8D70\u543B",
  "\u9501\u9AA8\u543B",
  "\u5582\u6C34\u543B",
  "\u76F2\u543B",
  "\u989D\u5934\u543B",
  "\u542E\u5438\u543B",
  "\u6CD5\u5F0F\u6DF1\u543B",
  "\u4E0B\u5DF4\u543B",
  "\u8E6D\u9F3B\u543B",
  "\u624B\u80CC\u543B",
  "\u7F20\u7EF5\u543B",
  "\u8F7B\u543B",
  "\u8033\u6735\u543B",
  "\u5E72\u543B",
  "\u6390\u8116\u543B",
  "\u6390\u8170\u543B",
  "\u6402\u8170\u543B",
  "\u6367\u8138\u543B",
  "\u8E2E\u811A\u543B",
  "\u9189\u9B3C\u543B",
  "\u98DE\u543B",
  "\u8725\u8734\u543B",
  "\u8718\u86DB\u4FA0\u543B",
  "\u70ED\u543B",
  "\u6DF1\u5589\u543B",
  "\u6E29\u67D4\u543B",
  "\u95F4\u63A5\u6027\u63A5\u543B",
  "\u58C1\u549A\u543B",
  "\u7518\u6CC9\u543B",
  "\u5543\u54AC\u543B",
  "\u8F7B\u5544\u543B",
  "\u6D45\u5C1D\u543B",
  "\u6DF1\u543B",
  "\u7F20\u7EF5\u543B",
  "\u989D\u5934\u543B",
  "\u7709\u773C\u543B",
  "\u9F3B\u5C16\u543B",
  "\u8138\u988A\u543B",
  "\u8033\u5782\u543B",
  "\u4E0B\u988C\u543B",
  "\u8116\u9888\u543B",
  "\u9501\u9AA8\u543B",
  "\u54AC\u5507\u543B",
  "\u542B\u5507\u543B",
  "\u6367\u8138\u543B",
  "\u58C1\u549A\u543B",
  "\u4FEF\u8EAB\u543B",
  "\u62E5\u62B1\u543B",
  "\u63FD\u8170\u543B",
  "\u6258\u4E0B\u5DF4\u543B",
  "\u7A81\u88AD\u543B",
  "\u8BD5\u63A2\u543B",
  "\u65E9\u5B89\u543B",
  "\u665A\u5B89\u543B",
  "\u79BB\u522B\u543B",
  "\u7EF5\u957F\u543B",
  "\u6025\u4FC3\u543B",
  "\u8E6D\u8138\u543B",
  "\u989D\u95F4\u76F8\u62B5\u543B",
  "\u9F3B\u5C16\u76F8\u8E6D\u543B",
  "\u95ED\u773C\u543B",
  "\u4FA7\u5934\u543B",
  "\u4EF0\u5934\u543B",
  "\u57CB\u9888\u543B\u5462\u5583\u543B",
  "\u542E\u543B",
  "\u7F31\u7EFB\u543B",
  "\u843D\u543B",
  "\u788E\u543B",
  "\u6162\u543B",
  "\u6025\u543B",
  "\u6175\u61D2\u543B",
  "\u9189\u543B",
  "\u54D1\u543B",
  "\u5BA0\u6EBA\u543B",
  "\u9738\u9053\u543B",
  "\u9752\u6DA9\u543B",
  "\u6E29\u67D4\u543B",
  "\u9738\u9053\u5F3A\u543B",
  "\u5C0F\u5FC3\u7FFC\u7FFC\u543B",
  "\u4E0B\u610F\u8BC6\u543B",
  "\u9152\u540E\u543B",
  "\u8D4C\u6C14\u543B",
  "\u548C\u597D\u543B",
  "\u5FC3\u52A8\u543B",
  "\u7F31\u7EFB\u7F20\u7EF5\u543B",
  "\u8033\u8FB9\u8F7B\u543B",
  "\u5507\u89D2\u543B",
  "\u5507\u89D2\u8F7B\u54AC\u543B",
  "\u5507\u7F1D\u543B",
  "\u7D27\u8D34\u543B",
  "\u547C\u5438\u4EA4\u7F20\u543B",
  "\u540E\u80CC\u62E5\u543B",
]
var wt = [
  "\u54AC\u8033\u5782",
  "\u8214\u8033\u5782",
  "\u634F\u8138",
  "\u543B\u624B\u80CC",
  "\u543B\u624B\u6307",
  "\u543B\u75E3",
  "\u543B\u624B\u5FC3",
  "\u4EB2\u8033\u5782",
  "\u543B\u773C\u89D2",
  "\u626F\u8896\u53E3",
  "\u543B\u9F3B\u5C16",
  "\u543B\u6CEA\u75E3",
  "\u62B9\u773C\u6CEA",
  "\u543B\u5634\u89D2",
  "\u57CB\u9888\u7A9D",
  "\u8E6D\u9888\u80A9",
  "\u57CB\u80A9\u62B1",
  "\u5171\u7528\u8033\u673A",
  "\u6367\u8138\u4EB2",
  "\u634F\u8033\u5782",
  "\u52FE\u4E0B\u5DF4",
  "\u62AC\u4E0B\u5DF4",
  "\u522E\u9F3B\u5C16",
  "\u52FE\u624B\u6307",
  "\u543B\u524D\u989D",
  "\u73A9\u5934\u53D1",
  "\u73A9\u53D1\u5C3E",
  "\u5439\u8033\u6735",
  "\u8E6D\u8138\u988A",
  "\u8E6D\u9888\u7A9D",
  "\u54AC\u8033\u6735",
  "\u9888\u4FA7\u543B",
  "\u9501\u9AA8\u543B",
  "\u773C\u5C3E\u543B",
  "\u63FD\u8170\u62B1",
  "\u4EB2\u5C0F\u8179",
  "\u78B0\u9F3B\u5C16",
  "\u6258\u5934\u4EB2",
  "\u58C1\u549A",
  "\u5708\u6000",
  "\u5077\u4EB2",
  "\u8FFD\u543B",
  "\u6342\u773C",
  "\u540E\u62B1",
  "\u8DE8\u817F\u5750",
  "\u63A5\u543B",
  "\u6572\u989D\u5934",
  "\u65E0\u610F\u8BC6\u6492\u5A07",
  "\u8170\u543B",
  "\u80A9\u5934\u543B",
  "\u5341\u6307\u76F8\u6263",
  "\u5BF9\u89C6",
  "\u7275\u624B\u8155",
]
var yt = "food",
  Et = [
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
  ]
function A(e) {
  return Et[e % Et.length]
}
function C(e, r) {
  return r.map((s, c) => ({ id: `${e}-${c + 1}`, label: s, weight: 1, color: A(c), enabled: !0 }))
}
var ye = [
  {
    id: "food",
    name: "\u4ECA\u5929\u5403\u4EC0\u4E48",
    description: "\u968F\u673A\u9009\u62E9\u4ECA\u5929\u7684\u9910\u996E\u7C7B\u578B",
    options: C("food", [
      "\u706B\u9505",
      "\u70E7\u70E4",
      "\u7092\u83DC",
      "\u9762\u98DF",
      "\u9EBB\u8FA3\u70EB",
      "\u6C49\u5821",
    ]),
  },
  {
    id: "weekend",
    name: "\u5468\u672B\u505A\u4EC0\u4E48",
    description: "\u4E3A\u5468\u672B\u5B89\u6392\u4E00\u70B9\u968F\u673A\u7075\u611F",
    options: C("weekend", [
      "\u770B\u7535\u5F71",
      "\u722C\u5C71",
      "\u901B\u8857",
      "\u770B\u4E66",
      "\u6253\u6E38\u620F",
      "\u4F11\u606F",
    ]),
  },
  {
    id: "task",
    name: "\u968F\u673A\u4EFB\u52A1",
    description:
      "\u4ECE\u5E38\u89C1\u4EFB\u52A1\u4E2D\u968F\u673A\u6311\u9009\u4E0B\u4E00\u4EF6\u4E8B",
    options: C("task", [
      "\u6574\u7406\u7B14\u8BB0",
      "\u5199\u4EE3\u7801",
      "\u590D\u4E60\u8BFE\u7A0B",
      "\u9605\u8BFB\u6587\u6863",
      "\u8FD0\u52A8",
      "\u4F11\u606F",
    ]),
  },
  {
    id: "kiss-hundred",
    name: "\u543B\u7684\u4E00\u767E\u79CD",
    description: "\u968F\u673A\u9009\u62E9\u4E00\u79CD\u4EB2\u543B\u65B9\u5F0F",
    options: C("kiss-hundred", gt),
  },
  {
    id: "love-hundred",
    name: "\u7231\u7684\u4E00\u767E\u79CD",
    description: "\u968F\u673A\u9009\u62E9\u4E00\u79CD\u4EB2\u5BC6\u4E92\u52A8",
    options: C("love-hundred", wt),
  },
]
function q(e) {
  return ye.find((r) => r.id === e)
}
function be(e) {
  return e.map((r) => ({ ...r }))
}
var ne = "quartz-wheel-session-v1",
  St = 300
function pn(e, r) {
  if (typeof e != "object" || e === null || Array.isArray(e)) return null
  let s = e
  if (
    typeof s.optionId != "string" ||
    typeof s.label != "string" ||
    typeof s.wheelName != "string" ||
    typeof s.drawnAt != "string"
  )
    return null
  let c = s.optionId.trim(),
    a = s.label.trim(),
    p = s.wheelName.trim(),
    y = s.drawnAt.trim(),
    O = typeof s.id == "string" ? s.id.trim() : ""
  if (!O || r.has(O))
    do O = te()
    while (r.has(O))
  return !c || !a || !p || !y || Number.isNaN(Date.parse(y))
    ? null
    : (r.add(O),
      {
        id: O,
        optionId: c,
        label: a,
        wheelName: p,
        drawnAt: y,
        completed: s.completed === !0,
      })
}
function fn() {
  let e = { version: 1, removeDrawn: !1, history: [] }
  try {
    let r = localStorage.getItem(ne)
    if (!r) return e
    let s = JSON.parse(r)
    if (typeof s != "object" || s === null || Array.isArray(s))
      throw new Error("\u62BD\u53D6\u4F1A\u8BDD\u683C\u5F0F\u65E0\u6548")
    let c = s
    if (c.version !== 1) throw new Error("\u62BD\u53D6\u4F1A\u8BDD\u7248\u672C\u65E0\u6548")
    let p = new Set(),
      a = Array.isArray(c.history)
        ? c.history
            .map((y) => pn(y, p))
            .filter((y) => y !== null)
            .slice(-St)
        : []
    return {
      version: 1,
      removeDrawn: typeof c.removeDrawn == "boolean" ? c.removeDrawn : !1,
      history: a,
    }
  } catch {
    try {
      localStorage.removeItem(ne)
    } catch {}
    return e
  }
}
var bt = 0
function te() {
  if (((bt += 1), globalThis.crypto?.randomUUID)) return `wheel-${globalThis.crypto.randomUUID()}`
  if (globalThis.crypto?.getRandomValues) {
    let e = new Uint32Array(2)
    return (globalThis.crypto.getRandomValues(e), `wheel-${e[0].toString(36)}-${e[1].toString(36)}`)
  }
  return `wheel-${Date.now().toString(36)}-${bt.toString(36)}`
}
function vt(e) {
  return !/\bvar\(/iu.test(e) && CSS.supports("color", e)
}
function H(e) {
  return e instanceof Error ? e.message : "\u53D1\u751F\u672A\u77E5\u9519\u8BEF"
}
function It() {
  let e = q(yt) ?? ye[0]
  if (!e) throw new Error("\u672A\u627E\u5230\u9ED8\u8BA4\u8F6C\u76D8\u9884\u8BBE")
  return {
    wheelId: e.id,
    wheelName: e.name,
    description: e.description ?? "",
    options: be(e.options),
    selectedPresetId: e.id,
    selectedIndex: null,
    currentRotation: 0,
    isSpinning: !1,
  }
}
function gn() {
  let e = It()
  try {
    let r = localStorage.getItem(B)
    if (!r) return { state: e }
    let s = pt(JSON.parse(r), { createId: te, colorForIndex: A, isColorSupported: vt })
    return {
      state: {
        wheelId: s.wheelId,
        wheelName: s.wheelName,
        description: s.description ?? "",
        options: s.options,
        selectedPresetId: q(s.selectedPresetId) ? s.selectedPresetId : "custom",
        selectedIndex: null,
        currentRotation: 0,
        isSpinning: !1,
      },
    }
  } catch (r) {
    try {
      localStorage.removeItem(B)
    } catch {}
    return {
      state: e,
      warning: `\u5DF2\u5FFD\u7565\u635F\u574F\u7684\u672C\u5730\u914D\u7F6E\uFF1A${H(r)}`,
    }
  }
}
function Lt() {
  let e = document.querySelector("[data-wheel-app]")
  if (!e || e.dataset.initialized === "true") return
  e.dataset.initialized = "true"
  let r = e.querySelector("[data-wheel-stage]"),
    s = e.querySelector("[data-wheel-canvas]"),
    c = e.querySelector("[data-wheel-start]"),
    a = e.querySelector("[data-wheel-start-label]"),
    p = e.querySelector("[data-wheel-five]"),
    y = e.querySelector("[data-wheel-ten]"),
    O = e.querySelector("[data-wheel-count]"),
    ve = e.querySelector("[data-wheel-mode]"),
    Ie = e.querySelector("[data-wheel-result]"),
    Le = e.querySelector("[data-wheel-result-kicker]"),
    Oe = e.querySelector("[data-wheel-result-value]"),
    Te = e.querySelector("[data-wheel-name]"),
    Me = e.querySelector("[data-wheel-preset]"),
    We = e.querySelector("[data-wheel-description]"),
    xe = e.querySelector("[data-wheel-editor]"),
    Ne = e.querySelector("[data-wheel-apply]"),
    He = e.querySelector("[data-wheel-import]"),
    Re = e.querySelector("[data-wheel-download]"),
    De = e.querySelector("[data-wheel-reset]"),
    _e = e.querySelector("[data-wheel-remove-drawn]"),
    Pe = e.querySelector("[data-wheel-restore-disabled]"),
    $e = e.querySelector("[data-wheel-file]"),
    Ce = e.querySelector("[data-wheel-message]"),
    Ae = e.querySelector("[data-wheel-mapping]"),
    ke = e.querySelector("[data-wheel-mapping-summary]"),
    Fe = e.querySelector("[data-wheel-mapping-list]"),
    Be = e.querySelector("[data-wheel-history-count]"),
    qe = e.querySelector("[data-wheel-history-list]"),
    ze = e.querySelector("[data-wheel-history-empty]"),
    Ue = e.querySelector("[data-wheel-clear-history]")
  if (
    !r ||
    !s ||
    !c ||
    !a ||
    !O ||
    !ve ||
    !Ie ||
    !Le ||
    !Oe ||
    !Te ||
    !Me ||
    !We ||
    !xe ||
    !Ne ||
    !He ||
    !Re ||
    !De ||
    !$e ||
    !Ce ||
    !Ae ||
    !ke ||
    !Fe ||
    !p ||
    !y ||
    !_e ||
    !Pe ||
    !Be ||
    !qe ||
    !ze ||
    !Ue
  ) {
    delete e.dataset.initialized
    return
  }
  let T = e,
    re = r,
    f = s,
    Ve = c,
    Ot = a,
    je = p,
    Je = y,
    Tt = O,
    Mt = ve,
    Wt = Ie,
    xt = Le,
    Nt = Oe,
    U = Te,
    oe = Me,
    Ht = We,
    V = xe,
    Rt = Ne,
    Dt = He,
    _t = Re,
    Pt = De,
    j = _e,
    Ke = Pe,
    J = $e,
    Xe = Ce,
    $t = Ae,
    Ct = ke,
    Ye = Fe,
    At = Be,
    Ge = qe,
    kt = ze,
    Qe = Ue,
    E = new AbortController(),
    ie = window.matchMedia("(prefers-reduced-motion: reduce)"),
    se = new Map(),
    le = gn(),
    o = le.state,
    Ft = fn(),
    b,
    w = Ft
  j.checked = w.removeDrawn
  let R, M, D, W, ae, ce
  function g(t, n = "info") {
    ;((Xe.textContent = t), (Xe.dataset.kind = n))
  }
  function findHistoryItem(t) {
    return w.history.find((n) => n.id === t)
  }
  function updateResultButton(t) {
    let n = findHistoryItem(t.dataset.historyId ?? ""),
      i = n?.completed === !0,
      d = t.dataset.resultLabel ?? "",
      u = t.querySelector("[data-wheel-result-status]")
    t.dataset.completed = String(i)
    t.setAttribute("aria-pressed", String(i))
    t.setAttribute(
      "aria-label",
      `${d}，${i ? "已完成，点击改为未完成" : "未完成，点击标记为已完成"}`,
    )
    if (u) u.textContent = i ? "✓ 已完成" : "未完成"
  }
  function makeResultButton(t, n) {
    const button = document.createElement("button")
    const value = document.createElement("span")
    const status = document.createElement("span")
    button.type = "button"
    button.className = "wheel-app__result-choice"
    button.dataset.wheelResultItem = ""
    button.dataset.historyId = t.historyId
    button.dataset.resultLabel = t.label
    value.className = "wheel-app__result-label"
    value.textContent = t.label
    status.className = "wheel-app__result-status"
    status.dataset.wheelResultStatus = ""

    if (n !== void 0) {
      const order = document.createElement("span")
      order.className = "wheel-app__result-index"
      order.textContent = String(n)
      button.append(order)
    }

    button.append(value, status)
    updateResultButton(button)
    return button
  }
  function refreshResultButtons() {
    for (const button of Nt.querySelectorAll("[data-wheel-result-item]")) {
      if (button instanceof HTMLButtonElement) updateResultButton(button)
    }
  }
  function _(t, n) {
    Wt.dataset.state = t
    xt.textContent = t === "complete" ? "抽中结果 · 点击可切换完成状态" : "当前状态"
    Nt.replaceChildren()

    if (t === "complete" && Array.isArray(n)) {
      if (n.length > 1) {
        const list = document.createElement("ol")
        list.className = "wheel-app__result-list"

        n.forEach((result, index) => {
          const item = document.createElement("li")
          item.append(makeResultButton(result, index + 1))
          list.append(item)
        })

        Nt.append(list)
        return
      }

      const result = n[0]
      if (!result) return
      const single = makeResultButton(result)
      single.classList.add("wheel-app__result-single")
      Nt.append(single)
      return
    }

    const text = document.createElement("span")
    text.className = t === "complete" ? "wheel-app__result-single" : "wheel-app__result-text"
    text.textContent = n
    Nt.append(text)
  }
  function k() {
    ;((o.selectedIndex = null), _("idle", "\u7B49\u5F85\u62BD\u53D6"))
  }
  function P() {
    return at(o.options)
  }
  function I() {
    let t = {
      version: 1,
      wheelId: o.wheelId,
      wheelName: o.wheelName.trim() || "\u968F\u673A\u8F6C\u76D8",
      description: o.description,
      selectedPresetId: o.selectedPresetId,
      options: o.options,
    }
    try {
      localStorage.setItem(B, JSON.stringify(t))
    } catch (n) {
      g(`\u914D\u7F6E\u6682\u65F6\u65E0\u6CD5\u4FDD\u5B58\uFF1A${H(n)}`, "error")
    }
  }
  function K() {
    try {
      localStorage.setItem(ne, JSON.stringify(w))
    } catch (t) {
      g(`\u62BD\u53D6\u8BB0\u5F55\u6682\u65F6\u65E0\u6CD5\u4FDD\u5B58\uFF1A${H(t)}`, "error")
    }
  }
  function Bt(t) {
    let n = new Date(t)
    return Number.isNaN(n.getTime())
      ? t
      : new Intl.DateTimeFormat("zh-CN", {
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: !1,
        }).format(n)
  }
  function de() {
    let t = P().length === 0,
      n = o.isSpinning
    ;((Ve.disabled = n || t),
      (je.disabled = n || t),
      (Je.disabled = n || t),
      (Ke.disabled = n || !o.options.some((i) => i.enabled === !1)),
      (Qe.disabled = n || w.history.length === 0),
      (Ot.textContent = n ? "\u62BD\u53D6\u4E2D\u2026" : "\u62BD\u53D6 1 \u6B21"))
  }
  function X() {
    let completedCount = w.history.filter((t) => t.completed === !0).length
    ;((At.textContent = `${w.history.length} 条 · ${completedCount} 已完成`),
      (kt.hidden = w.history.length > 0),
      (Ge.hidden = w.history.length === 0))
    let t = document.createDocumentFragment()
    for (let n = w.history.length - 1; n >= 0; n -= 1) {
      let i = w.history[n]
      if (!i) continue
      let d = document.createElement("li"),
        u = document.createElement("strong"),
        m = document.createElement("span"),
        h = document.createElement("span")
      ;((d.dataset.completed = String(i.completed === !0)),
        (u.className = "wheel-app__history-value"),
        (m.className = "wheel-app__history-meta"),
        (h.className = "wheel-app__history-status"),
        (u.textContent = i.label),
        (m.textContent = `${i.wheelName} · ${Bt(i.drawnAt)}`),
        (h.textContent = i.completed === !0 ? "✓ 已完成" : "未完成"),
        d.append(u, m, h),
        t.append(d))
    }
    ;(Ge.replaceChildren(t), refreshResultButtons(), de())
  }
  function qt(t) {
    let n = {
      id: te(),
      optionId: t.id,
      label: t.label,
      wheelName: o.wheelName.trim() || "随机转盘",
      drawnAt: new Date().toISOString(),
      completed: !1,
    }
    ;((w.history = [...w.history, n].slice(-St)), K(), X())
    return n
  }
  function toggleResultCompletion(t) {
    if (o.isSpinning) return
    let n = t.target
    if (!(n instanceof Element)) return
    let i = n.closest("[data-wheel-result-item]")
    if (!(i instanceof HTMLButtonElement) || !Nt.contains(i)) return
    let d = findHistoryItem(i.dataset.historyId ?? "")
    if (!d) return
    d.completed = !d.completed
    K()
    X()
    g(`已将“${d.label}”标记为${d.completed ? "已完成" : "未完成"}。`, "success")
  }
  function ue(t) {
    ;((o.isSpinning = t), (T.dataset.spinning = String(t)))
    let n = T.querySelectorAll("[data-wheel-control]")
    for (let i of n) i.disabled = t
    de()
  }
  function Ze(t) {
    let n = se.get(t)
    if (n) return n
    let i = document.createElement("span")
    ;((i.style.position = "absolute"),
      (i.style.visibility = "hidden"),
      (i.style.color = t),
      T.append(i))
    let d = getComputedStyle(i).color || t
    return (i.remove(), se.set(t, d), d)
  }
  function zt(t) {
    let n = Ze(t).match(/rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/iu)
    if (!n) return "#ffffff"
    let i = Number(n[1]) / 255,
      d = Number(n[2]) / 255,
      u = Number(n[3]) / 255,
      m = (h) => (h <= 0.03928 ? h / 12.92 : ((h + 0.055) / 1.055) ** 2.4)
    return 0.2126 * m(i) + 0.7152 * m(d) + 0.0722 * m(u) > 0.46 ? "#17212b" : "#ffffff"
  }
  function Ut(t, n) {
    let i = t < 8 ? 18 : t < 12 ? 16 : t < 20 ? 14 : t < 30 ? 11 : 10
    return Math.max(t >= 30 ? 8 : 9, Math.round(i * (n / 480)))
  }
  function et(t) {
    return t === 0 ? "\u7A7A" : t >= 51 ? "\u8272\u5757" : t >= 30 ? "\u6570\u5B57" : "\u6587\u5B57"
  }
  function Vt(t, n, i) {
    if (t.measureText(n).width <= i) return n
    let d = Array.from(n),
      u = 0,
      m = d.length,
      l = "\u2026"
    for (; u <= m; ) {
      let h = Math.floor((u + m) / 2),
        S = `${d.slice(0, h).join("")}\u2026`
      t.measureText(S).width <= i ? ((l = S), (u = h + 1)) : (m = h - 1)
    }
    return l
  }
  function jt() {
    let t = P(),
      n = getComputedStyle(re),
      i = Number.parseFloat(n.paddingLeft) + Number.parseFloat(n.paddingRight),
      d = re.getBoundingClientRect().width - i,
      u = Math.max(180, Math.min(560, Math.floor(d || 320))),
      m = Math.max(1, Math.min(window.devicePixelRatio || 1, 3)),
      l = f.getContext("2d")
    if (!l) {
      g(
        "\u5F53\u524D\u6D4F\u89C8\u5668\u65E0\u6CD5\u521B\u5EFA Canvas \u7ED8\u56FE\u73AF\u5883",
        "error",
      )
      return
    }
    if (
      ((f.width = Math.round(u * m)),
      (f.height = Math.round(u * m)),
      (f.style.width = `${u}px`),
      (f.style.height = `${u}px`),
      (f.style.transform = `rotate(${o.currentRotation}deg)`),
      f.setAttribute(
        "aria-label",
        `\u968F\u673A\u8F6C\u76D8\uFF0C\u5171 ${t.length} \u4E2A\u6709\u6548\u9009\u9879\uFF0C\u5F53\u524D\u4E3A${et(t.length)}\u6A21\u5F0F`,
      ),
      l.setTransform(m, 0, 0, m, 0, 0),
      l.clearRect(0, 0, u, u),
      t.length === 0)
    ) {
      f.setAttribute(
        "aria-label",
        "\u968F\u673A\u8F6C\u76D8\uFF0C\u5F53\u524D\u6CA1\u6709\u6709\u6548\u9009\u9879",
      )
      let N = u / 2,
        ee =
          getComputedStyle(document.documentElement).getPropertyValue("--lightgray").trim() ||
          "#d7d7d7"
      ;(l.beginPath(),
        l.arc(N, N, N - Math.max(6, u * 0.025), 0, Math.PI * 2),
        (l.fillStyle = ee),
        l.fill())
      return
    }
    let h = u / 2,
      S = h - Math.max(6, u * 0.025),
      v = (Math.PI * 2) / t.length,
      he = -Math.PI / 2 - v / 2,
      x = getComputedStyle(document.documentElement),
      Q = x.getPropertyValue("--light").trim() || "#ffffff",
      pe = x.getPropertyValue("--dark").trim() || "#222222",
      Z = x.getPropertyValue("--bodyFont").trim() || "sans-serif",
      rt = Ut(t.length, u)
    for (let [N, ee] of t.entries()) {
      let fe = he + N * v,
        sn = fe + v,
        ot = fe + v / 2,
        it = Ze(ee.color ?? A(N))
      if (
        (l.beginPath(),
        l.moveTo(h, h),
        l.arc(h, h, S, fe, sn),
        l.closePath(),
        (l.fillStyle = it),
        l.fill(),
        (l.strokeStyle = Q),
        (l.lineWidth = Math.max(1, u / 420)),
        l.stroke(),
        t.length >= 51)
      )
        continue
      let ln = ut(ee, N, t.length),
        an = S * (t.length >= 30 ? 0.73 : 0.62),
        st = S * (t.length >= 30 ? 0.23 : t.length < 12 ? 0.62 : 0.48)
      ;(l.save(),
        l.translate(h, h),
        l.rotate(ot),
        l.translate(an, 0),
        Math.cos(ot) < 0 && l.rotate(Math.PI),
        (l.fillStyle = zt(it)),
        (l.font = `650 ${rt}px ${Z}`),
        (l.textAlign = "center"),
        (l.textBaseline = "middle"),
        l.fillText(Vt(l, ln, st), 0, 0, st),
        l.restore())
    }
    ;(l.beginPath(),
      l.arc(h, h, Math.max(10, S * 0.075), 0, Math.PI * 2),
      (l.fillStyle = pe),
      l.fill(),
      (l.strokeStyle = Q),
      (l.lineWidth = Math.max(2, u / 180)),
      l.stroke())
  }
  function Y() {
    ;(R !== void 0 && window.cancelAnimationFrame(R),
      (R = window.requestAnimationFrame(() => {
        ;((R = void 0), jt())
      })))
  }
  function Jt(t) {
    let n = t.length >= 30 && t.length < 51
    if ((($t.hidden = !n), !n)) {
      Ye.replaceChildren()
      return
    }
    let i = document.createDocumentFragment()
    for (let [d, u] of t.entries()) {
      let m = document.createElement("li")
      ;((m.textContent = u.label), (m.value = d + 1), i.append(m))
    }
    ;(Ye.replaceChildren(i),
      (Ct.textContent = `1\uFF5E${t.length} \u4E0E\u5B8C\u6574\u540D\u79F0\u5BF9\u5E94`))
  }
  function L(t) {
    let n = P(),
      i = o.options.length - n.length
    ;((Tt.textContent = `${n.length} \u4E2A\u6709\u6548\u9009\u9879${i > 0 ? `\uFF08\u53E6\u6709 ${i} \u4E2A\u505C\u7528\uFF09` : ""}`),
      (Mt.textContent = n.length === 0 ? "\u5DF2\u62BD\u5B8C" : `${et(n.length)}\u6A21\u5F0F`),
      (Ht.textContent = o.description || "\u5F53\u524D\u81EA\u5B9A\u4E49\u8F6C\u76D8"),
      (oe.value = q(o.selectedPresetId) ? o.selectedPresetId : "custom"),
      (U.value = o.wheelName),
      t &&
        (V.value = o.options.map((d) => d.label).join(`
`)),
      Jt(n),
      Y(),
      de())
  }
  function Kt(t) {
    let n = q(t)
    if (!n) {
      ;((o.selectedPresetId = "custom"),
        (o.description = o.description || "\u5F53\u524D\u81EA\u5B9A\u4E49\u8F6C\u76D8"),
        I(),
        L(!1),
        g(
          "\u4FDD\u7559\u5F53\u524D\u9009\u9879\uFF0C\u5DF2\u5207\u6362\u5230\u81EA\u5B9A\u4E49\u6A21\u5F0F\u3002",
          "info",
        ))
      return
    }
    ;((o.wheelId = n.id),
      (o.wheelName = n.name),
      (o.description = n.description ?? ""),
      (o.options = be(n.options)),
      (o.selectedPresetId = n.id),
      (o.currentRotation = 0),
      (f.style.transition = "none"),
      k(),
      L(!0),
      I(),
      g(`\u5DF2\u5207\u6362\u5230\u201C${n.name}\u201D\u5E76\u4FDD\u5B58\u3002`, "success"))
  }
  function G(t) {
    try {
      let n = dt(V.value, { createId: te, colorForIndex: A })
      return (
        (o.options = n),
        (o.selectedPresetId = "custom"),
        (o.wheelId = o.wheelId || te()),
        (o.description =
          "\u4F7F\u7528\u7EAF\u6587\u672C\u7F16\u8F91\u7684\u81EA\u5B9A\u4E49\u9009\u9879"),
        (o.currentRotation = 0),
        (f.style.transition = "none"),
        k(),
        L(!1),
        I(),
        t &&
          g(`\u5DF2\u5E94\u7528\u5E76\u4FDD\u5B58 ${n.length} \u4E2A\u9009\u9879\u3002`, "success"),
        !0
      )
    } catch (n) {
      return (g(H(n), "error"), !1)
    }
  }
  function Xt(t, n, i) {
    ;((o.currentRotation = F(n)),
      (o.selectedIndex = t.index),
      (f.style.transition = "none"),
      (f.style.transform = `rotate(${o.currentRotation}deg)`))
    return mt(t, i)
  }
  function Yt(t, n) {
    return new Promise((i) => {
      let d = !1,
        u = (m) => {
          d ||
            ((d = !0),
            D !== void 0 && (window.clearTimeout(D), (D = void 0)),
            M !== void 0 && (window.cancelAnimationFrame(M), (M = void 0)),
            W && (f.removeEventListener("transitionend", W), (W = void 0)),
            (ce = void 0),
            i(m && T.isConnected))
        }
      ;((W = (m) => {
        m.target === f && m.propertyName === "transform" && u(!0)
      }),
        f.addEventListener("transitionend", W),
        (ce = () => u(!1)),
        (f.style.transition = `transform ${n}ms cubic-bezier(0.12, 0.72, 0.08, 1)`),
        f.getBoundingClientRect(),
        (M = window.requestAnimationFrame(() => {
          ;((M = void 0), (f.style.transform = `rotate(${t}deg)`))
        })),
        (D = window.setTimeout(() => u(!0), n + (ie.matches ? 250 : 750))))
    })
  }
  function Gt() {
    return new Promise((t) => {
      window.requestAnimationFrame(() => t())
    })
  }
  async function me(t) {
    if (o.isSpinning || (b !== void 0 && (window.clearTimeout(b), (b = void 0)), !tt() && !G(!1)))
      return
    let n = P().length
    if (n === 0) {
      g(
        "\u5F53\u524D\u6CA1\u6709\u53EF\u62BD\u53D6\u9009\u9879\uFF0C\u8BF7\u5148\u6062\u590D\u505C\u7528\u9879\u6216\u5E94\u7528\u65B0\u9009\u9879\u3002",
        "error",
      )
      return
    }
    let i = w.removeDrawn ? Math.min(t, n) : t,
      d = [],
      u = ""
    ;(ue(!0),
      _(
        "spinning",
        i === 1
          ? "\u6B63\u5728\u62BD\u53D6\u2026\u2026"
          : `\u6B63\u5728\u8FDB\u884C ${i} \u8FDE\u62BD\u2026\u2026`,
      ),
      g(
        w.removeDrawn && i < t
          ? `\u5F53\u524D\u4EC5\u5269 ${i} \u4E2A\u6709\u6548\u9009\u9879\uFF0C\u5C06\u62BD\u5B8C\u540E\u81EA\u52A8\u505C\u6B62\u3002`
          : "\u7ED3\u679C\u4F1A\u5728\u6BCF\u6B21\u8F6C\u76D8\u52A8\u753B\u7ED3\u675F\u540E\u8BB0\u5F55\u3002",
        "info",
      ))
    try {
      for (let l = 0; l < i; l += 1) {
        let h = P()
        if (h.length === 0) break
        let S = $(h.length),
          v = h[S]
        if (!v) throw new Error("\u672A\u80FD\u8BFB\u53D6\u62BD\u4E2D\u7684\u9009\u9879")
        let he = { index: S, option: v },
          x = t > 1,
          Q = ie.matches ? 1 : x ? 2 + $(2) : 5 + $(4),
          pe = ie.matches ? 80 : x ? 650 + $(251) : 4400 + $(1201),
          Z = ht(S, h.length, o.currentRotation, Q)
        if (
          (_(
            "spinning",
            x
              ? `\u7B2C ${l + 1} / ${i} \u6B21\uFF1A\u6B63\u5728\u62BD\u53D6\u2026\u2026`
              : "\u6B63\u5728\u62BD\u53D6\u2026\u2026",
          ),
          !(await Yt(Z, pe)))
        )
          return
        u = Xt(he, Z, h.length)
        let m = qt(v),
          result = { historyId: m.id, label: t === 1 ? u : v.label }
        ;(d.push(result),
          _("complete", [result]),
          w.removeDrawn && ((o.options = ct(o.options, v.id)), I(), L(!1), await Gt()))
      }
      if (!T.isConnected || d.length === 0) return
      ;(_("complete", d),
        w.removeDrawn && i < t
          ? g(
              `\u4EC5\u5269 ${i} \u4E2A\u6709\u6548\u9009\u9879\uFF0C\u5DF2\u5168\u90E8\u62BD\u5B8C\u5E76\u505C\u7528\u3002`,
              "success",
            )
          : g(
              `\u5DF2\u5B8C\u6210 ${d.length} \u6B21\u62BD\u53D6${w.removeDrawn ? "\uFF0C\u62BD\u4E2D\u9879\u5DF2\u505C\u7528\u3002" : "\u3002"}`,
              "success",
            ))
    } catch (m) {
      ;(d.length === 0 && _("idle", "\u7B49\u5F85\u62BD\u53D6"),
        g(`\u62BD\u53D6\u4E2D\u65AD\uFF1A${H(m)}`, "error"))
    } finally {
      T.isConnected && ue(!1)
    }
  }
  async function Qt() {
    let t = J.files?.[0]
    if (t)
      try {
        if (t.size > 1024 * 1024) throw new Error("JSON \u6587\u4EF6\u4E0D\u80FD\u8D85\u8FC7 1 MB")
        let n = JSON.parse(await t.text()),
          i = Ee(n, { createId: te, colorForIndex: A, isColorSupported: vt })
        ;((o.wheelId = i.id),
          (o.wheelName = i.name),
          (o.description = i.description),
          (o.options = i.options),
          (o.selectedPresetId = "custom"),
          (o.currentRotation = 0),
          (f.style.transition = "none"),
          k(),
          L(!0),
          I(),
          g(
            `\u5DF2\u5BFC\u5165\u201C${i.name}\u201D\uFF0C\u5171 ${P().length} \u4E2A\u6709\u6548\u9009\u9879\u3002`,
            "success",
          ))
      } catch (n) {
        g(`\u5BFC\u5165\u5931\u8D25\uFF1A${H(n)}`, "error")
      } finally {
        J.value = ""
      }
  }
  function Zt(t) {
    return (
      t
        .normalize("NFKC")
        .replace(/[<>:"/\\|?*\u0000-\u001f]/gu, "-")
        .trim()
        .replace(/\s+/gu, "-")
        .replace(/-+/gu, "-")
        .slice(0, 60) || "random-wheel"
    )
  }
  function tt() {
    let t = we(V.value)
    return t.length === o.options.length && t.every((n, i) => n === o.options[i]?.label)
  }
  function en() {
    try {
      if ((b !== void 0 && (window.clearTimeout(b), (b = void 0)), !tt() && !G(!1))) return
      o.wheelName = U.value.trim() || "\u968F\u673A\u8F6C\u76D8"
      let t = ft(o),
        n = new Blob([JSON.stringify(t, null, 2)], { type: "application/json;charset=utf-8" }),
        i = URL.createObjectURL(n),
        d = document.createElement("a")
      ;((d.href = i),
        (d.download = `wheel-${Zt(t.name)}.json`),
        (d.hidden = !0),
        document.body.append(d),
        d.click(),
        d.remove(),
        window.setTimeout(() => URL.revokeObjectURL(i), 1e3),
        I(),
        g("\u5DF2\u5BFC\u51FA\u5F53\u524D\u8F6C\u76D8 JSON \u914D\u7F6E\u3002", "success"))
    } catch (t) {
      g(`\u5BFC\u51FA\u5931\u8D25\uFF1A${H(t)}`, "error")
    }
  }
  function tn() {
    let t = o.options.filter((n) => n.enabled === !1).length
    t !== 0 &&
      ((o.options = o.options.map((n) => ({ ...n, enabled: !0 }))),
      (o.currentRotation = 0),
      (f.style.transition = "none"),
      k(),
      I(),
      L(!1),
      g(
        `\u5DF2\u6062\u590D ${t} \u4E2A\u505C\u7528\u9009\u9879\uFF0C\u53EF\u91CD\u65B0\u53C2\u4E0E\u62BD\u53D6\u3002`,
        "success",
      ))
  }
  function nn() {
    w.history.length !== 0 &&
      ((w.history = []),
      K(),
      k(),
      X(),
      g("\u5DF2\u6E05\u7A7A\u5386\u53F2\u62BD\u53D6\u8BB0\u5F55\u3002", "success"))
  }
  function rn() {
    ;((w.removeDrawn = j.checked),
      K(),
      g(
        w.removeDrawn
          ? "\u5DF2\u5F00\u542F\u81EA\u52A8\u505C\u7528\uFF0C\u540E\u7EED\u62BD\u53D6\u4E0D\u4F1A\u91CD\u590D\u3002"
          : "\u5DF2\u5173\u95ED\u81EA\u52A8\u505C\u7528\uFF0C\u62BD\u4E2D\u9879\u4F1A\u7EE7\u7EED\u4FDD\u7559\u3002",
        "success",
      ))
  }
  function on() {
    try {
      ;(localStorage.removeItem(B), localStorage.removeItem(ne))
    } catch {}
    ;((o = It()),
      (w = { version: 1, removeDrawn: !1, history: [] }),
      (j.checked = !1),
      (f.style.transition = "none"),
      k(),
      L(!0),
      X(),
      I(),
      K(),
      g(
        "\u5DF2\u6062\u590D\u9ED8\u8BA4\u8F6C\u76D8\uFF0C\u5E76\u6E05\u9664\u505C\u7528\u72B6\u6001\u4E0E\u5386\u53F2\u8BB0\u5F55\u3002",
        "success",
      ))
  }
  ;(Ve.addEventListener(
    "click",
    () => {
      me(1)
    },
    { signal: E.signal },
  ),
    je.addEventListener(
      "click",
      () => {
        me(5)
      },
      { signal: E.signal },
    ),
    Je.addEventListener(
      "click",
      () => {
        me(10)
      },
      { signal: E.signal },
    ),
    Nt.addEventListener("click", toggleResultCompletion, { signal: E.signal }),
    j.addEventListener("change", rn, { signal: E.signal }),
    Ke.addEventListener("click", tn, { signal: E.signal }),
    Qe.addEventListener("click", nn, { signal: E.signal }),
    oe.addEventListener("change", () => Kt(oe.value), { signal: E.signal }),
    Rt.addEventListener("click", () => G(!0), { signal: E.signal }),
    V.addEventListener(
      "input",
      () => {
        ;(b !== void 0 && window.clearTimeout(b),
          (b = window.setTimeout(() => {
            ;((b = void 0), G(!1))
          }, 450)))
      },
      { signal: E.signal },
    ),
    U.addEventListener(
      "input",
      () => {
        ;((o.wheelName = U.value), I())
      },
      { signal: E.signal },
    ),
    Dt.addEventListener("click", () => J.click(), { signal: E.signal }),
    J.addEventListener(
      "change",
      () => {
        Qt()
      },
      { signal: E.signal },
    ),
    _t.addEventListener("click", en, { signal: E.signal }),
    Pt.addEventListener("click", on, { signal: E.signal }))
  let nt = () => {
    ;(se.clear(), Y())
  }
  ;(document.addEventListener("themechange", nt),
    typeof ResizeObserver == "function"
      ? ((ae = new ResizeObserver(Y)), ae.observe(re))
      : window.addEventListener("resize", Y, { signal: E.signal }),
    L(!0),
    X(),
    ue(!1),
    le.warning && g(le.warning, "error"),
    window.addCleanup(() => {
      ;(E.abort(),
        document.removeEventListener("themechange", nt),
        ae?.disconnect(),
        ce?.(),
        b !== void 0 && window.clearTimeout(b),
        R !== void 0 && window.cancelAnimationFrame(R),
        M !== void 0 && window.cancelAnimationFrame(M),
        D !== void 0 && window.clearTimeout(D),
        W && f.removeEventListener("transitionend", W),
        (o.isSpinning = !1),
        delete T.dataset.initialized)
    }))
}
document.addEventListener("nav", Lt)
document.addEventListener("render", Lt)

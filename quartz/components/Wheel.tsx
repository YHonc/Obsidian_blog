import { QuartzComponent, QuartzComponentConstructor } from "./types"
import { WHEEL_PRESETS } from "./scripts/wheel-presets"
// @ts-expect-error - Quartz's build loader transpiles this client module and imports it as text.
import wheelScript from "./scripts/wheel.inline"
import wheelStyle from "./styles/wheel.scss"

function serializeWheelPresets(): string {
  return JSON.stringify(WHEEL_PRESETS)
    .replaceAll("<", "\\u003c")
    .replaceAll("\u2028", "\\u2028")
    .replaceAll("\u2029", "\\u2029")
}

const Wheel: QuartzComponent = () => {
  const serializedPresets = serializeWheelPresets()

  return (
    <section class="wheel-app" data-wheel-app aria-labelledby="wheel-app-title">
      <script
        type="application/json"
        data-wheel-presets=""
        dangerouslySetInnerHTML={{ __html: serializedPresets }}
      />
      <h2 id="wheel-app-title" class="wheel-app__sr-only">
        随机转盘操作区
      </h2>

      <div class="wheel-app__layout">
        <div class="wheel-app__play-panel">
          <div class="wheel-app__summary" aria-live="polite">
            <span class="wheel-app__badge" data-wheel-count>
              6 个有效选项
            </span>
            <span class="wheel-app__badge" data-wheel-mode>
              文字模式
            </span>
          </div>

          <div class="wheel-app__stage" data-wheel-stage>
            <div class="wheel-app__pointer" aria-hidden="true"></div>
            <canvas class="wheel-app__canvas" data-wheel-canvas role="img" aria-label="随机转盘">
              当前浏览器不支持 Canvas，请升级浏览器后重试。
            </canvas>
          </div>

          <div class="wheel-app__draw-actions" role="group" aria-label="抽取次数">
            <button class="wheel-app__start" type="button" data-wheel-start>
              <span data-wheel-start-label>抽取 1 次</span>
            </button>
            <button class="wheel-app__batch" type="button" data-wheel-five>
              5 连抽
            </button>
            <button class="wheel-app__batch" type="button" data-wheel-ten>
              10 连抽
            </button>
          </div>

          <div class="wheel-app__result" data-wheel-result data-state="idle" aria-live="polite">
            <span class="wheel-app__result-kicker" data-wheel-result-kicker>
              当前状态
            </span>
            <div class="wheel-app__result-value" data-wheel-result-value>
              <span class="wheel-app__result-text">等待抽取</span>
            </div>
          </div>
        </div>

        <div class="wheel-app__controls" aria-label="转盘设置">
          <section class="wheel-app__panel" aria-labelledby="wheel-basic-settings">
            <h3 id="wheel-basic-settings">转盘设置</h3>

            <label class="wheel-app__field">
              <span>转盘名称</span>
              <input
                type="text"
                value="今天吃什么"
                maxlength={80}
                autocomplete="off"
                data-wheel-name
                data-wheel-control
              />
            </label>

            <label class="wheel-app__field">
              <span>内置预设</span>
              <select data-wheel-preset data-wheel-control>
                {WHEEL_PRESETS.map((preset) => (
                  <option value={preset.id}>{preset.name}</option>
                ))}
                <option value="custom">自定义 / 已导入</option>
              </select>
            </label>

            <label class="wheel-app__toggle">
              <input type="checkbox" data-wheel-remove-drawn data-wheel-control />
              <span class="wheel-app__toggle-copy">
                <strong>抽中后自动停用</strong>
                <small>从转盘移除，后续抽取不再重复</small>
              </span>
            </label>

            <p class="wheel-app__description" data-wheel-description>
              随机选择今天的餐饮类型
            </p>
          </section>

          <section class="wheel-app__panel" aria-labelledby="wheel-option-editor">
            <div class="wheel-app__panel-heading">
              <h3 id="wheel-option-editor">自定义选项</h3>
              <span>每行一个，2～150 个</span>
            </div>

            <label class="wheel-app__field" for="wheel-options-input">
              <span class="wheel-app__sr-only">转盘选项，每行一个</span>
              <textarea
                id="wheel-options-input"
                rows={9}
                spellcheck={false}
                data-wheel-editor
                data-wheel-control
              ></textarea>
            </label>

            <div class="wheel-app__actions">
              <button type="button" data-wheel-apply data-wheel-control>
                应用选项
              </button>
              <button
                class="wheel-app__button--quiet"
                type="button"
                data-wheel-restore-disabled
                data-wheel-control
              >
                恢复全部停用项
              </button>
              <button type="button" data-wheel-import data-wheel-control>
                导入 JSON
              </button>
              <button type="button" data-wheel-download data-wheel-control>
                导出 JSON
              </button>
              <button
                class="wheel-app__button--quiet"
                type="button"
                data-wheel-reset
                data-wheel-control
              >
                恢复默认
              </button>
            </div>

            <input
              type="file"
              accept="application/json,.json"
              hidden
              aria-label="选择转盘 JSON 配置文件"
              data-wheel-file
              data-wheel-control
            />

            <p class="wheel-app__message" data-wheel-message role="status" aria-live="polite">
              修改有效内容后会自动重绘并保存在当前浏览器。
            </p>
          </section>

          <details class="wheel-app__panel wheel-app__disclosure" data-wheel-history-details>
            <summary class="wheel-app__disclosure-summary">
              <span class="wheel-app__disclosure-title">历史抽取记录</span>
              <span class="wheel-app__disclosure-meta" data-wheel-history-count>
                0 条
              </span>
            </summary>

            <div class="wheel-app__disclosure-body">
              <div class="wheel-app__history-toolbar">
                <p class="wheel-app__description">最新结果显示在最前面，并同步保留完成状态。</p>
                <button
                  class="wheel-app__button--quiet"
                  type="button"
                  data-wheel-clear-history
                  data-wheel-control
                >
                  清空记录
                </button>
              </div>

              <ol class="wheel-app__history-list" data-wheel-history-list></ol>
              <p class="wheel-app__history-empty" data-wheel-history-empty>
                暂无抽取记录
              </p>
            </div>
          </details>

          <details
            class="wheel-app__panel wheel-app__disclosure wheel-app__mapping"
            data-wheel-mapping
            aria-label="编号映射"
            hidden
          >
            <summary class="wheel-app__disclosure-summary">
              <span class="wheel-app__disclosure-title">编号映射</span>
              <span class="wheel-app__disclosure-meta" data-wheel-mapping-summary>
                数字与完整选项名称
              </span>
            </summary>
            <div class="wheel-app__disclosure-body">
              <ol class="wheel-app__mapping-list" data-wheel-mapping-list></ol>
            </div>
          </details>
        </div>
      </div>
    </section>
  )
}

Wheel.css = wheelStyle
Wheel.afterDOMLoaded = wheelScript

export default (() => Wheel) satisfies QuartzComponentConstructor

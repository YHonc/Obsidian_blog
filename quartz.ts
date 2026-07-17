import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import ConditionalRender from "./quartz/components/ConditionalRender"
import Wheel from "./quartz/components/Wheel"
import { PageTypes } from "./quartz/plugins"

const config = await loadQuartzConfig()
const layout = await loadQuartzLayout()
const wheelPage = ConditionalRender({
  component: Wheel(),
  condition: ({ fileData }) => fileData.slug === "tools/wheel",
})
const contentLayout = layout.byPageType.content ?? {}

layout.byPageType.content = {
  ...contentLayout,
  beforeBody: [...(contentLayout.beforeBody ?? layout.defaults.beforeBody ?? []), wheelPage],
}

// Quartz 5.0.0 creates its dispatcher inside loadQuartzConfig(), before this TS layout override.
// Replace that dispatcher so the site-specific component participates in rendering and resources.
config.plugins.emitters = config.plugins.emitters.filter(
  (emitter) => emitter.name !== "PageTypeDispatcher",
)
config.plugins.emitters.push(PageTypes.PageTypeDispatcher(layout))

export default config
export { layout }

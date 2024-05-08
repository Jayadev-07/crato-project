import themeConfig from "@assets/data/themeConfig"
import { devtools } from "zustand/middleware"
import { shallow } from "zustand/shallow"
import { createWithEqualityFn } from "zustand/traditional"

const initialValue = {
  skin: themeConfig.layout.skin,
  isRTL: themeConfig.layout.isRTL,
  layout: themeConfig.layout.type,
  lastLayout: themeConfig.layout.type,
  menuCollapsed: themeConfig.layout.menu.isCollapsed,
  footerType: themeConfig.layout.footer.type,
  navbarType: themeConfig.layout.navbar.type,
  menuHidden: themeConfig.layout.menu.isHidden,
  contentWidth: themeConfig.layout.contentWidth,
  routerTransition: themeConfig.layout.routerTransition,
  navbarColor: themeConfig.layout.navbar.backgroundColor,
  isSubmenuCollapsed: themeConfig.layout.menu.isSubmenuCollapsed
}
type Value = typeof initialValue
type Keys = keyof Value
type LayoutActions = {
  updateLayout: (key: Keys, value: Value[Keys]) => any
  reset: () => any
}
export type LayoutSliceType = Value & LayoutActions

const useLayoutStore = createWithEqualityFn<LayoutSliceType>()(
  devtools(
    (set) => ({
      ...initialValue,
      updateLayout: (key, value) => set(() => ({ [key]: value }), false, "updateLayout"),
      reset: () => set(initialValue, false, "reset")
    }),
    { name: "layout", store: "useLayoutStore" }
  ),
  shallow
)

export default useLayoutStore

export type LayoutType = "vertical" | "horizontal" | "blank"

export type NavBarType = "floating" | "sticky" | "static" | "hidden"

export type LayoutStoreType = {
  skin: string
  isRTL: boolean
  layout: string
  lastLayout: string
  menuCollapsed: boolean
  footerType: string
  navbarType: string
  menuHidden: boolean
  contentWidth: string
  routerTransition: string
  navbarColor: string
}

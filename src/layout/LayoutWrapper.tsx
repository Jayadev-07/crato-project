import { Fragment, useEffect, memo } from "react"
import classnames from "classnames"

import "animate.css/animate.css"
import useLayoutStore from "@src/store/layout"

const LayoutWrapper = (props: any) => {
  const { children, routeMeta } = props

  const layout = useLayoutStore((s) => s.layout)
  const setLayout = useLayoutStore((s) => s.updateLayout)
  const contentWidth = useLayoutStore((s) => s.contentWidth)
  const routerTransition = useLayoutStore((s) => s.routerTransition)

  const layoutStored = layout
  const transition = routerTransition

  const appLayoutCondition =
    (layoutStored === "horizontal" && !routeMeta) ||
    (layoutStored === "horizontal" && routeMeta && !routeMeta.appLayout)
  const Tag = appLayoutCondition ? "div" : Fragment

  const cleanUp = () => {
    if (routeMeta) {
      if (routeMeta.contentWidth) setLayout("contentWidth", "full")

      if (routeMeta.menuCollapsed) setLayout("menuCollapsed", !routeMeta.menuCollapsed)

      if (routeMeta.menuHidden) setLayout("menuHidden", !routeMeta.menuHidden)
    }
  }

  // ** ComponentDidMount
  useEffect(() => {
    if (routeMeta) {
      if (routeMeta.contentWidth) setLayout("contentWidth", routeMeta.contentWidth)

      if (routeMeta.menuCollapsed) setLayout("menuCollapsed", routeMeta.menuCollapsed)

      if (routeMeta.menuHidden) setLayout("menuHidden", routeMeta.menuHidden)
    }
    return () => cleanUp()
  }, [routeMeta])

  return (
    <div
      className={classnames("app-content content overflow-hidden", {
        [routeMeta ? routeMeta.className : ""]: routeMeta && routeMeta.className,
        "show-overlay": false
      })}
    >
      <div className="content-overlay"></div>
      <div className="header-navbar-shadow" />
      <div
        className={classnames({
          "content-wrapper": routeMeta && !routeMeta.appLayout,
          "content-area-wrapper": routeMeta && routeMeta.appLayout,
          "container-xxl p-0": contentWidth === "boxed",
          [`animate__animated animate__${transition}`]:
            transition !== "none" && transition.length
        })}
      >
        <Tag {...(appLayoutCondition ? { className: "content-body" } : {})}>
          {children}
        </Tag>
      </div>
    </div>
  )
}

export default memo(LayoutWrapper)

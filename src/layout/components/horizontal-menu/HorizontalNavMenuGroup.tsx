import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import classnames from "classnames"
import { usePopper } from "react-popper"
import { hasActiveChild } from "@src/layout/utils"
import useLayoutStore from "@src/store/layout"
import HorizontalNavMenuItems from "./HorizontalNavMenuItems"

const applyHeight = {
  enabled: true,
  name: "applyHeight",
  phase: "beforeWrite",
  fn: (data: any) => {
    const pageHeight = window.innerHeight,
      popperEl = data.state.elements.popper,
      ddTop = popperEl.getBoundingClientRect().top,
      ddHeight = popperEl.clientHeight
    let maxHeight, stylesObj
    // ** Calculate and set height
    if (pageHeight - ddTop - ddHeight - 28 < 1) {
      maxHeight = pageHeight - ddTop - 25
      stylesObj = {
        maxHeight,
        overflowY: "auto"
      }
    }
    const ddRef = popperEl.getBoundingClientRect()
    // ** If there is not space left to open sub menu open it to the right
    if (ddRef.left + ddRef.width - (window.innerWidth - 16) >= 0) {
      popperEl.closest(".dropdown").classList.add("openLeft")
    }
    data.state.styles.popper = { ...data.state.styles.popper, ...stylesObj }
  }
} as any

const HorizontalNavMenuGroup = (props: any) => {
  // ** Props
  const { item, submenu, isChild } = props

  // ** State
  const [menuOpen, setMenuOpen] = useState(false)
  const [popperElement, setPopperElement] = useState(null)
  const [referenceElement, setReferenceElement] = useState(null)

  // ** Hooks
  const isRtl = useLayoutStore((state) => state.isRTL)

  // ** Vars
  const popperOffsetHorizontal = isRtl ? 16 : -16
  const popperPlacement = isRtl ? "bottom-end" : "bottom-start"
  const popperPlacementSubMenu = isRtl ? "left-start" : "right-start"

  // ** Hooks
  const currentURL = useLocation().pathname
  const { update, styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: isChild ? popperPlacementSubMenu : popperPlacement,
    modifiers: [
      applyHeight,
      {
        enabled: true,
        name: "offset",
        options: {
          offset: isChild ? [-8, 15] : [popperOffsetHorizontal, 5]
        }
      }
    ]
  })

  const handleMouseEnter = () => {
    setMenuOpen(true)
    update?.()
  }
  const Icon = item.icon

  return (
    <li
      ref={setReferenceElement as any}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setMenuOpen(false)}
      className={classnames("dropdown", {
        show: menuOpen,
        "nav-item": submenu === false,
        "dropdown-submenu": submenu === true,
        "sidebar-group-active active": hasActiveChild(item, currentURL)
      })}
      style={{ padding: submenu ? "0rem 0.5rem" : ".5rem", fontSize: ".9rem" }}
    >
      <Link
        to="/"
        onClick={(e) => e.preventDefault()}
        className={classnames("dropdown-toggle d-flex align-items-center", {
          "dropdown-item": submenu === true,
          "nav-link": submenu === false
        })}
        style={{ padding: ".5rem", margin: "0" }}
      >
        <Icon style={{ width: "16px", aspectRatio: "1/1" }} />
        <span id={item.title}>{item.title}</span>
      </Link>
      <ul
        ref={setPopperElement as any}
        style={{ ...styles.popper }}
        {...attributes.popper}
        className={classnames("dropdown-menu", {
          "first-level": submenu === false
        })}
      >
        <HorizontalNavMenuItems
          isChild={true}
          submenu={true}
          parentItem={item}
          menuOpen={menuOpen}
          items={item.children}
          setMenuOpen={setMenuOpen}
        />
      </ul>
    </li>
  )
}

export default HorizontalNavMenuGroup

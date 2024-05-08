import { ChildWrap, NavigationType } from "@src/types/router"
import classNames from "classnames"
import { Link, useLocation } from "react-router-dom"
import { Collapse } from "reactstrap"
import VerticalNavMenuItems from "./VerticalNavMenuItems"
import { ReactNode, useContext, useEffect } from "react"
import { VerticalSideBarContext } from "../SidebarComponent"
import { hasActiveChild, removeChildren } from "@src/layout/utils"
import useLayoutStore from "@src/store/layout"

const VerticalNavMenuGroup = (props: Props) => {
  const { item, parentItem } = props
  const {
    groupActive,
    menuCollapsed,
    setGroupActive,
    setGroupOpen,
    menuHover,
    groupOpen,
    currentActiveGroup,
    setCurrentActiveGroup,
    menuData
  } = useContext(VerticalSideBarContext)

  const location = useLocation()
  const currentURL = useLocation().pathname

  const openClassCondition = (id: string) => {
    if ((menuCollapsed && menuHover) || menuCollapsed === false) {
      if (groupActive.includes(id) || groupOpen.includes(id)) return true
    } else if (groupActive.includes(id) && menuCollapsed && menuHover === false) {
      return false
    } else {
      return null
    }
  }

  const toggleOpenGroup = (item: ChildWrap, parent: any) => {
    let openGroup = groupOpen
    const activeGroup = groupActive

    // ** If Group is already open and clicked, close the group
    if (openGroup.includes(item.title)) {
      openGroup.splice(openGroup.indexOf(item.title), 1)

      // ** If clicked Group has open group children, Also remove those children to close those groups
      if (item.children) {
        removeChildren(item.children, openGroup, groupActive)
      }
    } else if (
      activeGroup.includes(item.title) ||
      currentActiveGroup.includes(item.title)
    ) {
      // ** If Group clicked is Active Group

      // ** If Active group is closed and clicked again, we should open active group else close active group
      if (!activeGroup.includes(item.title) && currentActiveGroup.includes(item.title)) {
        activeGroup.push(item.title)
      } else {
        activeGroup.splice(activeGroup.indexOf(item.title), 1)
      }

      // ** Update Active Group
      setGroupActive([...activeGroup])
    } else if (parent) {
      // ** If Group clicked is the child of a open group, first remove all the open groups under that parent
      if (parent.children) {
        removeChildren(parent.children, openGroup, groupActive)
      }

      // ** After removing all the open groups under that parent, add the clicked group to open group array
      if (!openGroup.includes(item.title)) {
        openGroup.push(item.title)
      }
    } else {
      // ** If clicked on another group that is not active or open, create openGroup array from scratch

      // ** Empty Open Group array
      openGroup = []

      // ** Push current clicked group item to Open Group array
      if (!openGroup.includes(item.title)) {
        openGroup.push(item.title)
      }
    }
    setGroupOpen([...openGroup])
  }

  const onCollapseClick = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    item: ChildWrap
  ) => {
    toggleOpenGroup(item, parentItem)

    e.preventDefault()
  }

  useEffect(() => {
    let groupHeaders: string[] = []
    const isSubmenuCollapsed = useLayoutStore.getState().isSubmenuCollapsed

    if (isSubmenuCollapsed) {
      groupHeaders = extractTitlesWithChildren(menuData)
    } else if (hasActiveChild(item, currentURL)) {
      if (!groupActive.includes(item.title)) groupActive.push(item.title)
    } else {
      const index = groupActive.indexOf(item.title)
      if (index > -1) groupActive.splice(index, 1)
    }
    const activeGroup = isSubmenuCollapsed ? groupHeaders : [...groupActive]

    setGroupActive(activeGroup)
    setCurrentActiveGroup(activeGroup)
    setGroupOpen([])
  }, [location])

  const Icon = item.icon
  return (
    <li
      className={classNames("nav-item has-sub", {
        open: openClassCondition(item.title),
        "menu-collapsed-open": groupActive.includes(item.title),
        "sidebar-group-active":
          groupActive.includes(item.title) ||
          groupOpen.includes(item.title) ||
          currentActiveGroup.includes(item.title)
      })}
      style={{ fontSize: ".9rem !important" }}
    >
      <Link
        className="d-flex align-items-center "
        style={{ marginRight: "10px", display: "flex", alignItems: "center" }}
        to="/"
        onClick={(e) => onCollapseClick(e, item)}
      >
        <div>
          <Icon style={{ width: "16px", aspectRatio: "1/1" }} />
        </div>
        <div
          className="menu-title text-truncate"
          style={{
            marginTop: "0.4rem",
            // marginBottom: ".4rem",
            paddingBottom: ".2rem",
            fontSize: ".9rem"
          }}
          id={item.title}
        >
          {item.title}
        </div>
      </Link>

      {/* Render Child Recursively Through VerticalNavMenuItems Component */}
      <ul className="menu-content ">
        <Collapse
          isOpen={
            (groupActive && groupActive.includes(item.title)) ||
            (groupOpen && groupOpen.includes(item.title))
          }
        >
          <VerticalNavMenuItems
            items={item.children as unknown as NavigationType}
            parentItem={item}
          />
        </Collapse>
      </ul>
    </li>
  )
}

export default VerticalNavMenuGroup

const extractTitlesWithChildren = (navigation: NavigationType): string[] => {
  const titles: string[] = []

  const traverse = (items: any[] | undefined) => {
    if (!items) return

    items.forEach((item) => {
      if ("children" in item) {
        titles.push(item.title)
        traverse(item.children)
      }
    })
  }

  traverse(navigation)

  return titles
}

interface Props {
  item: ChildWrap
  children?: ReactNode
  parentItem?: any
}

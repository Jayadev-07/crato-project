import { NavigationType } from "@src/types/router"
import classNames from "classnames"
import { createContext, useRef, useState } from "react"
// import PerfectScrollbar from "react-perfect-scrollbar"
import VerticalMenuHeader from "./vertical-menu/VerticalMenuHeader"
import VerticalNavMenuItems from "./vertical-menu/VerticalNavMenuItems"

const defaultContextValue = {
  menuCollapsed: true,
  menuData: [] as NavigationType,
  skin: "light",
  menuHover: false,
  setGroupOpen: () => {},
  setMenuVisibility: () => {},
  groupOpen: [],
  activeItem: null,
  setActiveItem: () => {},
  groupActive: [],
  setGroupActive: () => {},
  currentActiveGroup: [],
  setCurrentActiveGroup: () => {}
}
export const VerticalSideBarContext =
  createContext<VerticalSideBarContextType>(defaultContextValue)
const SidebarComponent = (props: Props) => {
  const { menuCollapsed, menuData, skin, setMenuVisibility } = props

  const [menuHover, setMenuHover] = useState(false)
  const [groupOpen, setGroupOpen] = useState<any[]>([])
  const [activeItem, setActiveItem] = useState<any>(null)
  const [groupActive, setGroupActive] = useState<any[]>([])
  const [currentActiveGroup, setCurrentActiveGroup] = useState<any[]>([])

  const shadowRef = useRef<HTMLDivElement>(null)
  const onMouseEnter = () => {
    setMenuHover(true)
  }

  return (
    <VerticalSideBarContext.Provider
      value={{
        menuCollapsed,
        menuData,
        groupOpen,
        menuHover,
        skin,
        setGroupOpen,
        setMenuVisibility,
        activeItem,
        setActiveItem,
        groupActive,
        setGroupActive,
        currentActiveGroup,
        setCurrentActiveGroup
      }}
    >
      <div
        className={classNames("main-menu menu-fixed menu-accordion menu-shadow", {
          expanded: menuHover || menuCollapsed === false,
          "menu-light": skin !== "semi-dark" && skin !== "dark",
          "menu-dark": skin === "semi-dark" || skin === "dark"
        })}
        onMouseEnter={onMouseEnter}
        onMouseLeave={() => setMenuHover(false)}
      >
        <>
          {/* Vertical Menu Header */}
          <VerticalMenuHeader />

          {/* Vertical Menu Header Shadow */}
          <div className="shadow-bottom" ref={shadowRef} />

          {/* Perfect Scrollbar */}
          {/* <PerfectScrollbar
            className="main-menu-content"
            options={{ wheelPropagation: false }}
            onScrollY={(container) => scrollMenu(container)}
          > */}
          <ul className="navigation navigation-main">
            <VerticalNavMenuItems items={menuData} />
          </ul>
          {/* </PerfectScrollbar> */}
        </>
      </div>
    </VerticalSideBarContext.Provider>
  )
}

export default SidebarComponent

type Props = {
  skin: string
  menuData: NavigationType
  menuCollapsed: boolean
  setMenuVisibility: React.Dispatch<React.SetStateAction<boolean>>
}

type VerticalSideBarContextType = {
  menuHover: boolean
  groupOpen: any[]
  activeItem: null
  setActiveItem: React.Dispatch<React.SetStateAction<any>>
  setGroupOpen: React.Dispatch<React.SetStateAction<any[]>>
  groupActive: any[]
  setGroupActive: React.Dispatch<React.SetStateAction<any[]>>
  currentActiveGroup: any[]
  setCurrentActiveGroup: React.Dispatch<React.SetStateAction<any[]>>
} & Props

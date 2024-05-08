import { NavLink } from "react-router-dom"
import classnames from "classnames"
// import useFilter from "@hooks/useFilter"
import { ChildWrap } from "@src/types/router"
import { useContext, ReactNode } from "react"
import { VerticalSideBarContext } from "../SidebarComponent"

const VerticalNavMenuLink = ({ item }: Props) => {
  const { activeItem } = useContext(VerticalSideBarContext)

  //   const { clearAllFiter } = useFilter()[3]
  const Icon = item.icon
  return (
    <li
      //   onClick={() => clearAllFiter()}
      className={classnames({
        "nav-item": !item.children,
        active: item.navLink === activeItem
      })}
    >
      <NavLink
        style={{ marginRight: "10px", display: "flex", alignItems: "center" }}
        target={undefined}
        to={item.navLink || "/"}
        className={({ isActive }) => {
          if (isActive) return "d-flex align-items-center active"
          return "d-flex align-items-center m-0"
        }}
        onClick={(e) => {
          if (item.navLink?.length === 0 || item.navLink === "#") {
            e.preventDefault()
          }
        }}
      >
        <div>
          <Icon style={{ width: "16px", aspectRatio: "1/1" }} />
        </div>

        <div
          className="menu-item text-truncate"
          style={{
            marginTop: "0.4rem",
            paddingBottom: ".2rem",
            fontSize: ".9rem"
          }}
          id={item.title}
        >
          {item.title}
        </div>
      </NavLink>
    </li>
  )
}

export default VerticalNavMenuLink

interface Props {
  item: ChildWrap
  children?: ReactNode
}

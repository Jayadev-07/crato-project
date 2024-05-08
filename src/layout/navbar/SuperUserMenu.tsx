import { Tooltip } from "antd"
import cratoflowFullLogo from "@assets/images/logo-full.png"
import { Link, useLocation } from "react-router-dom"
import { NavItem, NavLink } from "reactstrap"
import * as Icon from "react-feather"

const baseName = "" //import.meta.env.VITE_BASE_NAME
const SuperUserMenu = () => {
  const { pathname } = useLocation()

  return (
    <ul className="nav navbar-nav bookmark-icons">
      {superUserMenuList.map((item) => {
        const IconTag = Icon[item.icon as Icon]
        return (
          <NavItem key={item.title} className="d-none d-sm-flex">
            <NavLink tag={Link} to={item.link} id={item.title}>
              <Tooltip title={item.title} placement="bottom">
                <IconTag
                  className="ficon"
                  color={pathname === item.link ? "#40dc65" : "#000"}
                />
              </Tooltip>
            </NavLink>
          </NavItem>
        )
      })}

      <img
        src={cratoflowFullLogo}
        alt="Cratoflow Logo"
        style={{ width: "150px" }}
        className="nav-cratoflow-logo d-none d-sm-flex"
      />
    </ul>
  )
}

export default SuperUserMenu

export const superUserMenuList = [
  {
    title: "Home",
    icon: "Home",
    link: `${baseName}/company`
  }
  // {
  //   title: "Role Management",
  //   icon: "Shield",
  //   link: `${baseName}/role-management`
  // },
  // {
  //   title: "Manage Users",
  //   icon: "Users",
  //   link: `${baseName}/manage-users`
  // }
]

type Icon = "Home" | "Shield" | "Users"

import { useContext, useEffect } from "react"
import { NavLink } from "react-router-dom"
import { X } from "react-feather"
import { VerticalSideBarContext } from "../SidebarComponent"
import themeConfig from "@assets/data/themeConfig"

const VerticalMenuHeader = () => {
  const { menuHover, menuCollapsed, setMenuVisibility, setGroupOpen } =
    useContext(VerticalSideBarContext)

  useEffect(() => {
    if (!menuHover && menuCollapsed) setGroupOpen([])
  }, [menuHover, menuCollapsed])

  return (
    <div
      className="navbar-header"
      style={{
        height: "fit-content",
        padding: "1rem .5rem 0 0.7rem",
        display: "flex",
        justifyContent: "space-between"
      }}
    >
      <NavLink
        to={"/"}
        className="navbar-brand p-0 m-0"
        style={{
          marginLeft: "1.3rem !important",
          marginTop: "1rem !important"
        }}
      >
        <span className="brand-logo">
          <img src={themeConfig.app.appLogoImage} alt="logo" />
        </span>
        <h2 className="brand-text mb-0">{themeConfig.app.appName}</h2>
      </NavLink>

      {/* Commenting Sidebar Toggle Icon */}

      <div className="nav-link modern-nav-toggle cursor-pointer">
        <X
          onClick={() => setMenuVisibility(false)}
          className="toggle-icon icon-x d-block d-xl-none"
          size={20}
        />
      </div>
    </div>
  )
}

export default VerticalMenuHeader

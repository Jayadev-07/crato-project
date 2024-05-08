import { NavItem, NavLink } from "reactstrap"
import { Dispatch, SetStateAction } from "react"
import * as Icon from "react-feather"
import RightNav from "./RightNav"
import SuperUserMenu, { superUserMenuList } from "./SuperUserMenu"
import SandBoxEnv from "./components/SandBoxEnv"
import TestCompany from "./components/TestCompany"
import LeftNav from "./components/LeftNav"
import useCompanyData from "@src/store/companyData"

const Menu = Icon.Menu
const baseName = import.meta.env.VITE_BASE_NAME
const Navbar = (props: Props) => {
  const { setMenuVisibility } = props
  const companyMode = useCompanyData((s) => s.companyMode)
  const isCompanyPage = routeList.includes(location.pathname)

  const accessToken = localStorage.getItem("accessToken")
  const showSuperUserMenu = superUserRouteList.includes(location.pathname) && accessToken

  return (
    <>
      <div
        className="bookmark-wrapper d-flex align-items-center "
        style={{ fontSize: ".9rem" }}
      >
        {!isCompanyPage && (
          <ul className="navbar-nav d-xl-none ">
            <NavItem className="mobile-menu me-auto">
              <NavLink
                className="nav-menu-main menu-toggle hidden-xs is-active"
                onClick={() => setMenuVisibility(true)}
              >
                <Menu className="ficon" />
              </NavLink>
            </NavItem>
          </ul>
        )}
        {showSuperUserMenu ? (
          <SuperUserMenu />
        ) : (
          <>
            <LeftNav />
            <SandBoxEnv />
            {companyMode == "TEST" && <TestCompany />}
          </>
        )}
      </div>

      <RightNav />
    </>
  )
}

export default Navbar

type Props = {
  setMenuVisibility: Dispatch<SetStateAction<boolean>>
}

const routeList = [
  `${baseName}/view-profile`,
  `${baseName}/company`,
  `${baseName}/manage-users`,
  `${baseName}/role-management`
]

export const superUserRouteList = superUserMenuList.map(({ link }) => baseName + link)

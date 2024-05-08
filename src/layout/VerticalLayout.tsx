import classNames from "classnames"
import { ReactNode, useEffect, useState } from "react"
import { Navbar, Button } from "reactstrap"
import { ArrowUp } from "react-feather"
import { NavBarType } from "@src/types/store/layout"
import useLayoutStore from "@src/store/layout"
import SidebarComponent from "./components/SidebarComponent"
import NavbarComponent from "@src/layout/navbar"
import themeConfig from "@assets/data/themeConfig"
import ScrollToTop from "@custom-components/ScrollToTop"
import FooterComponent from "./components/FooterComponent"
import { NavigationType } from "@src/types/router"

const VerticalLayout: React.FC<Props> = (props) => {
  const { children, menuData } = props
  const contentWidth = useLayoutStore((s) => s.contentWidth)
  const navbarType = useLayoutStore((s) => s.navbarType)
  const footerType = useLayoutStore((s) => s.footerType)
  const menuCollapsed = useLayoutStore((s) => s.menuCollapsed)
  const isHidden = useLayoutStore((s) => s.menuHidden)
  const skin = useLayoutStore((s) => s.skin)
  const navbarColor = useLayoutStore((s) => s.navbarColor)
  const setLayout = useLayoutStore((state) => state.updateLayout)
  const layout = useLayoutStore((state) => state.layout)
  const lastLayout = useLayoutStore((state) => state.lastLayout)

  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const [menuVisibility, setMenuVisibility] = useState(false)

  const navbarClasses = {
    floating: contentWidth === "boxed" ? "floating-nav container-xxl" : "floating-nav",
    sticky: "fixed-top",
    static: "navbar-static-top",
    hidden: "d-none"
  }

  const resizeHandler = () => {
    setWindowWidth(window.innerWidth)
    if (window.innerWidth < BREAK_POINT) {
      if (layout != "vertical") setLayout("layout", "vertical")
    } else {
      if (lastLayout == "horizontal") setLayout("layout", "horizontal")
    }
  }

  useEffect(() => {
    addEventListener("resize", resizeHandler)
    return () => {
      removeEventListener("resize", resizeHandler)
    }
  }, [windowWidth])

  useEffect(() => {
    if (menuVisibility && windowWidth < 1200) {
      setMenuVisibility(false)
    }
  }, [location])

  const bgColorCondition =
    navbarColor !== "" && navbarColor !== "light" && navbarColor !== "white"

  return (
    <div
      className={classNames(
        `wrapper vertical-layout ${
          navbarWrapperClasses[navbarType as NavBarType] || "navbar-floating"
        } ${footerClasses[footerType as keyof typeof footerClasses] || "footer-static"}`,
        {
          // Modern Menu
          "vertical-menu-modern": windowWidth >= 1200,
          "menu-collapsed": menuCollapsed && windowWidth >= 1200,
          "menu-expanded": !menuCollapsed && windowWidth > 1200,

          // Overlay Menu
          "vertical-overlay-menu": windowWidth < 1200,
          "menu-hide": !menuVisibility && windowWidth < 1200,
          "menu-open": menuVisibility && windowWidth < 1200
        }
      )}
      {...(isHidden ? { "data-col": "1-column" } : {})}
    >
      {!isHidden ? (
        <SidebarComponent
          skin={skin}
          menuData={menuData}
          menuCollapsed={menuCollapsed}
          setMenuVisibility={setMenuVisibility}
        />
      ) : null}

      <Navbar
        expand="lg"
        container={false}
        light={skin !== "dark"}
        dark={skin === "dark" || bgColorCondition}
        color={bgColorCondition ? navbarColor : undefined}
        className={classNames(
          `header-navbar navbar align-items-center ${
            navbarClasses[navbarType as keyof typeof navbarClasses] || "floating-nav"
          } navbar-shadow`
        )}
      >
        <div
          className="navbar-container d-flex content align-items-center"
          style={{ padding: "8px" }}
        >
          <NavbarComponent setMenuVisibility={setMenuVisibility} />
        </div>
      </Navbar>

      {children}

      <div
        className={classNames("sidenav-overlay", {
          show: menuVisibility
        })}
        onClick={() => setMenuVisibility(false)}
      />

      <FooterComponent />

      {themeConfig.layout.scrollTop ? (
        <div className="scroll-to-top">
          <ScrollToTop showOffset={300} className="scroll-top d-block">
            <Button className="btn-icon" color="primary">
              <ArrowUp size={14} />
            </Button>
          </ScrollToTop>
        </div>
      ) : null}
    </div>
  )
}

export default VerticalLayout

const BREAK_POINT = 1200

type Props = {
  children: ReactNode
  menuData: NavigationType
}

const navbarWrapperClasses = {
  floating: "navbar-floating",
  sticky: "navbar-sticky",
  static: "navbar-static",
  hidden: "navbar-hidden"
}

const footerClasses = {
  static: "footer-static",
  sticky: "footer-fixed",
  hidden: "footer-hidden"
}

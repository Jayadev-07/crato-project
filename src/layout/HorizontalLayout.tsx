import useLayoutStore from "@src/store/layout"
import classNames from "classnames"
import { ReactNode, useEffect, useState } from "react"
import { Button, Navbar } from "reactstrap"
import NavbarComponent from "@src/layout/navbar"
import { NavigationType } from "@src/types/router"
import FooterComponent from "./components/FooterComponent"
import themeConfig from "@assets/data/themeConfig"
import ScrollToTop from "@custom-components/ScrollToTop"
import { ArrowUp } from "react-feather"
import HorizontalNavMenuItems from "./components/horizontal-menu/HorizontalNavMenuItems"

const HorizontalLayout: React.FC<Props> = (props) => {
  const { children, menuData } = props
  const navbarType = useLayoutStore((state) => state.navbarType)
  const contentWidth = useLayoutStore((state) => state.contentWidth)
  const isHidden = useLayoutStore((state) => state.menuHidden)
  const footerType = useLayoutStore((state) => state.footerType)
  const setLayout = useLayoutStore((state) => state.updateLayout)

  const [navbarScrolled, setNavbarScrolled] = useState(false)
  const [menuVisibility, setMenuVisibility] = useState(false)
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  const navbarClasses = {
    floating: contentWidth === "boxed" ? "floating-nav container-xxl" : "floating-nav",
    sticky: "fixed-top"
  }

  const cleanup = () => {
    setNavbarScrolled(false)
  }

  useEffect(() => {
    window.addEventListener("scroll", function () {
      if (window.pageYOffset > 65 && navbarScrolled === false) {
        setNavbarScrolled(true)
      }
      if (window.pageYOffset < 65) {
        setNavbarScrolled(false)
      }
    })
    return () => cleanup()
  }, [])

  const resizeHandler = () => {
    setWindowWidth(window.innerWidth)
    if (window.innerWidth < BREAK_POINT) setLayout("layout", "vertical")
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

  return (
    <div
      className={classNames(
        `wrapper horizontal-layout horizontal-menu ${
          navbarWrapperClasses[navbarType as keyof typeof navbarWrapperClasses] ||
          "navbar-floating"
        } ${
          footerClasses[footerType as keyof typeof footerClasses] || "footer-static"
        } menu-expanded`
      )}
      {...(isHidden ? { "data-col": "1-column" } : {})}
    >
      <Navbar
        expand="lg"
        container={false}
        className={classNames(
          "header-navbar navbar-fixed align-items-center navbar-shadow navbar-brand-center",
          {
            "navbar-scrolled": navbarScrolled
          }
        )}
      >
        <div className="navbar-container d-flex content" style={{ background: "#fff" }}>
          <NavbarComponent setMenuVisibility={setMenuVisibility} />
        </div>
      </Navbar>

      {!isHidden ? (
        <div className="horizontal-menu-wrapper">
          <Navbar
            tag="div"
            expand="sm"
            light
            className={classNames(
              `header-navbar navbar-horizontal navbar-shadow menu-border`,
              {
                [navbarClasses[navbarType as keyof typeof navbarClasses]]:
                  navbarType !== "static",
                "floating-nav":
                  (!navbarClasses[navbarType as keyof typeof navbarClasses] &&
                    navbarType !== "static") ||
                  navbarType === "floating"
              }
            )}
          >
            <div
              className="navbar-container main-menu-content"
              style={{ padding: "0", marginTop: "10px" }}
            >
              <ul className="nav navbar-nav" id="main-menu-navigation">
                <HorizontalNavMenuItems submenu={false} items={menuData} />
              </ul>
            </div>
          </Navbar>
        </div>
      ) : null}

      {children}

      <FooterComponent />

      {themeConfig.layout.scrollTop === true ? (
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

export default HorizontalLayout

const BREAK_POINT = 1200
const navbarWrapperClasses = {
  floating: "navbar-floating",
  sticky: "navbar-sticky",
  static: "navbar-static"
}

const footerClasses = {
  static: "footer-static",
  sticky: "footer-fixed",
  hidden: "footer-hidden"
}

type Props = {
  children: ReactNode
  menuData: NavigationType
}

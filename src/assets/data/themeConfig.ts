import appLogoImage from "@assets/images/logo.png"
import appLogoFull from "@assets/images/logo-full.png"
const themeConfig = {
  app: {
    appName: "Cratoflow",
    appLogoImage,
    appLogoFull
  },
  color: "#34a353",
  layout: {
    isRTL: false,
    skin: "light", // light, dark, bordered, semi-dark
    routerTransition: "zoomIn", // fadeIn, fadeInLeft, zoomIn, none or check this for more transition https://animate.style/
    type: "vertical", // vertical, horizontal
    contentWidth: "boxed", // full, boxed
    menu: {
      isHidden: false,
      isCollapsed: true,
      isSubmenuCollapsed: false
    },
    navbar: {
      // ? For horizontal menu, navbar type will work for navMenu type
      type: "sticky", // static , sticky , floating, hidden
      backgroundColor: "white" // BS color options [primary, success, etc]
    },
    footer: {
      type: "static" // static, sticky, hidden
    },
    customizer: false,
    scrollTop: true, // Enable scroll to top button
    toastPosition: "top-right"
  }
}

export default themeConfig

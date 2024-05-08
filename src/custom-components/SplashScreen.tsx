import "@src/scss/components/splash-screen.scss"
import CratoFLowLogoLoader from "@assets/svg/crato-loader.svg?react"

const SplashScreen = () => {
  return (
    <div id="splashWrapper">
      <div className="context">
        <div id="splash-screen">
          <div className="loadWrapper">
            <CratoFLowLogoLoader className="splashLogo" />
            <div className="loader" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SplashScreen

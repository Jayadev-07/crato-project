import { Suspense } from "react"
import { ThemeContext } from "@src/providers/ThemeContext"
import SplashScreen from "@custom-components/SplashScreen"
import AntdThemeContextProvider from "./AntdThemeContextProvider"
import NetworkWrapper from "@custom-components/NetworkWrapper"
import ErrorBoundary from "@custom-components/ErrorBoundry"
import IdleTimer from "@custom-components/IdleTimer"

const AppProvider = ({ children }: any) => {
  return (
    <Suspense fallback={<SplashScreen />}>
      <ThemeContext>
        <AntdThemeContextProvider>
          <NetworkWrapper>
            <ErrorBoundary>
              <IdleTimer>{children}</IdleTimer>
            </ErrorBoundary>
          </NetworkWrapper>
        </AntdThemeContextProvider>
      </ThemeContext>
    </Suspense>
  )
}

export default AppProvider

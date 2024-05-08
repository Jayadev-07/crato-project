import { ConfigProvider, theme as antdTheme, notification } from "antd"
import { ReactNode } from "react"

const fontFamily: string = "'Inter', Helvetica, Arial, serif"
const primary = "#34a353"
const primaryHalfOpacity = "#34a353a3"

notification.config({
  placement: "top",
  maxCount: 3
})

const AntdThemeContextProvider = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <ConfigProvider
        theme={{
          token: {
            // Base Color
            fontFamily,
            colorPrimary: primary,
            colorText: "#6e6b7b"
          },
          algorithm: antdTheme.compactAlgorithm,
          components: {
            Table: { headerBg: "rgb(243 242 247)", headerColor: "#6e6b7b" },
            Button: {
              colorPrimary: primary,
              colorLink: primary,
              colorLinkHover: primaryHalfOpacity,
              colorLinkActive: primary
            }
          }
        }}
      >
        {children}
      </ConfigProvider>
    </>
  )
}

export default AntdThemeContextProvider

import { LayoutType } from "@src/types/store/layout"
import { Outlet } from "react-router-dom"
import VerticalLayout from "./VerticalLayout"
import HorizontalLayout from "./HorizontalLayout"
import BlankLayout from "./BlankLayout"
import navigation from "@src/layout/menus"

const Layout = (props: Props) => {
  const { layout } = props
  const LAYOUT = {
    vertical: VerticalLayout,
    horizontal: HorizontalLayout,
    blank: BlankLayout
  }
  const WrapperLayout = LAYOUT[layout]

  return (
    <WrapperLayout menuData={navigation}>
      <Outlet />
    </WrapperLayout>
  )
}

export default Layout

type Props = { layout: LayoutType }

// import { useContext } from "react"
// import { VerticalSideBarContext } from "../SidebarComponent"
import VerticalNavMenuLink from "./VerticalNavMenuLink"
import VerticalNavMenuGroup from "./VerticalNavMenuGroup"
import VerticalNavMenuSectionHeader from "./VerticalNavMenuSectionHeader"
import { resolveVerticalNavMenuItemComponent as resolveNavItemComponent } from "@src/layout/utils"
import { ChildWrap, NavigationType } from "@src/types/router"

const Components = {
  VerticalNavMenuLink,
  VerticalNavMenuGroup,
  VerticalNavMenuSectionHeader
}
const VerticalNavMenuItems = ({
  items,
  parentItem
}: {
  items: NavigationType
  parentItem?: any
}) => {
  // const { menuData } = useContext(VerticalSideBarContext)

  const RenderNavItems = items.map((item) => {
    const TagName = Components[resolveNavItemComponent(item) as ComponentsType]
    // TODO
    if (item.children)
      return <TagName item={item as ChildWrap} key={item.title} parentItem={parentItem} />
    return <TagName item={item as ChildWrap} key={item.title} parentItem={parentItem} />
  })
  return RenderNavItems
}

export default VerticalNavMenuItems

type ComponentsType = keyof typeof Components

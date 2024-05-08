import { ChildWrap, NavigationType } from "@src/types/router"
import HorizontalNavMenuLink from "./HorizontalNavMenuLink"
import HorizontalNavMenuGroup from "./HorizontalNavMenuGroup"
import { resolveHorizontalNavMenuItemComponent as resolveNavItemComponent } from "@src/layout/utils"
import { Dispatch, SetStateAction } from "react"

const HorizontalNavMenuItems = (props: Props) => {
  const Components = {
    HorizontalNavMenuGroup,
    HorizontalNavMenuLink
  }

  const RenderNavItems = props.items.map((item, idx) => {
    const TagName = Components[resolveNavItemComponent(item) as keyof typeof Components]
    //TODO
    if (item.children) {
      return <TagName key={idx} item={item as ChildWrap} {...props} />
    }
    return <TagName key={idx} item={item as ChildWrap} {...props} />
  })

  return RenderNavItems
}

export default HorizontalNavMenuItems

type Props = {
  items: NavigationType
  submenu: boolean
  parentItem?: NavigationType
  isChild?: boolean
  menuOpen?: boolean
  setMenuOpen?: Dispatch<SetStateAction<boolean>>
}

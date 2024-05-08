import { Icon } from "react-feather"

export type TSettingRoute = TRoute[]
export type TRoute = {
  id: string
  title: string
  icon: Icon
  children: Children[]
}
export interface Children {
  id: string
  title: string
  navLink: string
}

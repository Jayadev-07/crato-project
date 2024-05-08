import { Icon } from "react-feather"

export type NavigationType = ParentWrap[]

type ParentWrap = {
  title: string
  icon: Icon
  accessId?: string
  children?: ChildWrap[]
}

export type WithoutChildren = {
  accessRestricted: boolean
  navLink: string
  children?: never
  title: string
  icon: Icon
  accessId: string
}
export type WithChildren = {
  children: GrantChild[]
  navLink?: never
  title: string
  icon: Icon
  accessId: string
}
type GrantChild = {
  title: string
  icon: Icon
  accessId: string
  isHaveGrantParent?: boolean
  grantParentId?: string
  navLink: string
}

export type ChildWrap = WithChildren | WithoutChildren

export type RouterType = RouterItem[]

export type RouterItem = {
  path: string
  accessMap?: string | string[]
  element: JSX.Element
  meta?: Partial<{
    publicRoute: boolean
    restricted: boolean
    layout: "vertical" | "horizontal" | "blank"
    menuHidden: boolean
    accessRestricted: boolean
  }>
}

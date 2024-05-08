import { FC } from "react"
import UniSelect, { UniSelectProps } from "./UniSelect"
import MultiSelect, { MultiSelectProps } from "./MultiSelect"
import DatePicker, { DatePickrProps } from "./DatePicker"

const PopupFilter: FC<Props> = (props) => {
  const { type, ...rest } = props

  switch (type) {
    case "single":
      return <UniSelect {...(rest as UniSelectProps)} />
    case "multi":
      return <MultiSelect {...(rest as MultiSelectProps)} />
    case "date":
      return <DatePicker {...(rest as DatePickrProps)} />
    default:
      return <></>
  }
}

export default PopupFilter

type Single = { type: "single" } & UniSelectProps
type Multi = { type: "multi" } & MultiSelectProps
type Date = { type: "date" } & DatePickrProps
type Props = Single | Multi | Date

export type OptionsType = {
  label: string
  value: string
}[]

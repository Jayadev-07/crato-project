import dayjs from "dayjs"
import { useState, useEffect, FC, CSSProperties } from "react"
import { Check, X } from "react-feather"
import { DatePicker as AntdDatePicker } from "antd"

import {
  Button,
  ButtonDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle
} from "reactstrap"

import "@scss/components/date-picker.scss"
import { OptionsType } from "."

const DatePicker: FC<DatePickrProps> = (props) => {
  const {
    name,
    onChange,
    value,
    dateRequired,
    defaultDate,
    displayValue,
    options: defaultOptions = ["Today", "This week", "This month", "This year"]
  } = props

  const isArrayOfString = defaultOptions.every((v) => typeof v === "string")
  const options: string[] = isArrayOfString
    ? (defaultOptions as string[])
    : (defaultOptions as unknown as OptionsType).map(({ label }) => label)

  const [isOpen, setIsOpen] = useState(false)
  const [display, setDisplay] = useState<null | string>(dateRequired ? "Today" : "")
  //   const selector = useSelector((state) => state)
  const dateFormat = DF

  useEffect(() => {
    if (!value?.[0]) setDisplay(null)
  }, [value])

  const datePickerChange = (date: string[] | string | Date[]) => {
    if (date.length != 2) return
    setIsOpen(false)
    const [start, end] = date
    setDisplay(`${dayjs(start).format(dateFormat)} to ${dayjs(end).format(dateFormat)}`)
    onChange([dayjs(start).format(DF), dayjs(end).format(DF)], "custom-date")
  }

  const onDateChange = (e: string) => {
    let [from, to] = ["", ""]
    if (e == display && !dateRequired) {
      setDisplay(null)
      onChange([from, to], e, "RESET")
      return
    }
    if (!isArrayOfString) {
      const optionObj: Options =
        (defaultOptions as unknown as OptionsType).find(({ label }) => label === e) ??
        ({} as Options)
      onChange(optionObj.value ?? "", optionObj.label ?? "")
      setDisplay(e)
      return
    }
    from = presetRange[e as keyof typeof presetRange]
    to = dayjs().format(DF)
    onChange([from, to], e)
    setDisplay(e)
  }

  useEffect(() => {
    if (displayValue && options.includes(displayValue)) return setDisplay(displayValue)
    if (defaultDate && options.includes(defaultDate)) return onDateChange(defaultDate)
    if (defaultDate) return datePickerChange(defaultDate)
  }, [])
  const isActive = display && options.filter((val) => val == display).length == 0

  return (
    <ButtonDropdown
      isOpen={isOpen}
      toggle={(e: any) => {
        if (isOpen && stopPropagation(e.srcElement)) return
        setIsOpen((s) => !s)
      }}
      direction="down"
      className="filterButton"
      size="sm"
    >
      <DropdownToggle outline={!display} color="primary" caret id="date">
        {display ? display : name ? name : "Date Range"}
      </DropdownToggle>
      <DropdownMenu className="filterMenu " style={{ width: "210px" }} id="select-date">
        {options.map((val, id) => (
          <DropdownItem
            key={id}
            style={{
              width: "100%",
              height: "100%",
              position: "relative",
              display: "flex",
              justifyContent: "space-between"
            }}
            onClick={() => onDateChange(val)}
          >
            {val}
            {display == val && <Check style={{ color: "#34a353" }} />}
          </DropdownItem>
        ))}
        <DropdownItem
          onClick={(e) => e.preventDefault()}
          style={style as CSSProperties}
          className="show-on-wrappper"
        >
          <div className="datePickerWrapper">
            <p>Custom Date</p>

            <AntdDatePicker.RangePicker
              value={value as any}
              className="form-control customDatePicker"
              onChange={(_, s) => datePickerChange(s)}
              style={{ opacity: "0 !important" }}
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {isActive && (
            <>
              <Button
                className="btn-icon hover-show clear-btn "
                color="flat-danger"
                onClick={() => {
                  onChange(["", ""], "", "RESET")
                  setDisplay(null)
                }}
              >
                <X size={16} />
              </Button>
              <div className="hover-hide">
                <Check style={{ color: "#34a353" }} />
              </div>
            </>
          )}
        </DropdownItem>
      </DropdownMenu>
    </ButtonDropdown>
  )
}

export default DatePicker

const DF = "YYYY-MM-DD"

const presetRange = {
  "Previous day": dayjs().subtract(1, "day").format(DF),
  Today: dayjs().format(DF),
  "This week": dayjs().startOf("week").format(DF),
  "Previous week": dayjs().subtract(1, "week").startOf("week").format(DF),
  "Previous month": dayjs().subtract(1, "month").startOf("month").format(DF),
  "This month": dayjs().startOf("month").format(DF),
  "Previous year": dayjs().subtract(1, "year").startOf("year").format(DF),
  "This year": dayjs().startOf("year").format(DF)
}

const stopPropagation = (e: any): any => {
  try {
    const { parentNode, className } = e
    return parentNode.nodeName != "BODY"
      ? stopPropagation(parentNode)
      : className.includes("flatpickr-calendar")
  } catch (error) {
    return false
  }
}
const style = {
  width: "100%",
  height: "100%",
  position: "relative",
  padding: "0",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
}

export type DatePickrProps = {
  value: string[]

  displayValue?: string
  dateRequired?: string
  defaultDate?: keyof typeof presetRange

  name: string
} & {
  options?: OptionsType
  onChange: (value: string, type: string, isReset?: "RESET") => void
} & {
  options?: string[]
  onChange: (value: string[], type: string, isReset?: "RESET") => void
}

type Options = {
  label: string
  value: string
}

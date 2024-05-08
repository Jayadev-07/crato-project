import { useState, useEffect, FC } from "react"
import { Check } from "react-feather"

import {
  UncontrolledButtonDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Input
} from "reactstrap"
import { OptionsType } from "."
import "@scss/components/popup-filter.scss"

const UniSelect: FC<UniSelectProps> = (props) => {
  const {
    onChange = () => {},
    options = [],
    value: popupval = "",
    label = "",
    name = "Select...",
    radio = false,
    id = `Select-${props.name}`
  } = props

  const activeOption = options.find(({ value, label }) => {
    if (typeof value === "string") return value == popupval
    return label == popupval
  })

  const [search, setSearch] = useState("")

  useEffect(() => {
    setSearch("")
  }, [popupval])

  const optionsToRendor = () =>
    options.filter(
      ({ label }) => search == "" || label.toLowerCase().includes(search.toLowerCase())
    )

  return (
    <UncontrolledButtonDropdown
      direction="down"
      className={`filterButton ${!options.length ? "is-disabled" : ""}`}
      size="sm"
      disabled={!options.length}
      id={id}
    >
      <DropdownToggle
        outline={!activeOption}
        color={!options.length ? "secondary" : "primary"}
        caret
      >
        {activeOption?.label ? `${label ? name : ""} ${activeOption?.label}` : name}
      </DropdownToggle>
      <DropdownMenu className="filterMenu">
        <div className="form-floating">
          <Input
            type="search"
            id="floatingInput"
            placeholder={`Search ${name}`}
            value={search}
            onChange={({ target: { value } }) => setSearch(value)}
            autoComplete="off"
          />
          <label htmlFor="floatingInput">Search {name}</label>
        </div>
        {optionsToRendor().length ? (
          optionsToRendor().map(({ label, value }, index) => (
            <DropdownItem
              tag="button"
              style={{
                width: "100%",
                padding: ".8rem 1rem",
                // position: "relative"
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}
              id={`${id}-${index}`}
              onClick={() => {
                if (radio && value === activeOption?.value) return
                onChange(activeOption?.value == value ? null : value)
              }}
              key={index}
            >
              {label}
              {activeOption?.value == value && <Check style={{ color: "#34a353" }} />}
            </DropdownItem>
          ))
        ) : (
          <DropdownItem style={{ textAlign: "center", width: "100%" }}>
            No match found
          </DropdownItem>
        )}
      </DropdownMenu>
    </UncontrolledButtonDropdown>
  )
}

export default UniSelect

export type UniSelectProps = Partial<{
  name: string
  options: OptionsType
  onChange: (value: null | string) => void
  value: string
  label: string
  radio: boolean
  id: string
}>

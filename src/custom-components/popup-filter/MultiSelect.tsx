import { useState, useEffect, useMemo, useRef, FC } from "react"
import { X } from "react-feather"

import {
  Button,
  ButtonDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Input
} from "reactstrap"
import { OptionsType } from "."
import "@scss/components/popup-filter.scss"

const MultiSelect: FC<MultiSelectProps> = (props) => {
  const {
    id = props.name ?? "Select",
    name = "Select...",
    onChange = () => {},
    options = [],
    value: popupValue = []
  } = props

  const [displayName, setDisplayName] = useState(name)
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [data, setData] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) inputRef.current?.focus()
    setData(popupValue)
    setDisplayName(popupValue.length ? `${name}  (${popupValue.length})` : name)
    setSearch("")
  }, [popupValue.length, isOpen])

  const optionsToRendor = () =>
    options.filter(
      ({ label }) => search == "" || label.toLowerCase().includes(search.toLowerCase())
    )

  const badges = useMemo(
    () =>
      data?.length ? (
        <div className="custom-badge-container">
          {options
            .filter(({ value }) => data.includes(value))
            .map(({ label, value }) => (
              <div className="custom-badge" key={value}>
                <div>{label}</div>
                <button
                  onClick={() => {
                    setData((s) => s.filter((item) => item != value))
                  }}
                >
                  <X size={16} style={{ marginBottom: "2px" }} />
                </button>
              </div>
            ))}
          <DropdownItem divider />
        </div>
      ) : (
        <></>
      ),
    [data.length]
  )

  const selectAllFilter = () => {
    if (data.length) setSearch("")
    setData((s) => (s.length ? [] : optionsToRendor().map(({ value }) => value)))
  }

  return (
    <ButtonDropdown
      isOpen={isOpen}
      toggle={() => setIsOpen((s) => !s)}
      direction="down"
      size="sm"
      disabled={!options.length}
      id={id}
      className={`filterButton ${!options.length ? "is-disabled" : ""}`}
    >
      <DropdownToggle
        outline={!popupValue.length}
        color={!options.length ? "secondary" : "primary"}
        caret
      >
        {displayName}
      </DropdownToggle>
      <DropdownMenu className="filterMenu">
        {badges}
        <div className="form-floating">
          <Input
            type="search"
            innerRef={inputRef}
            id="floatingInput"
            placeholder={`Search ${name}`}
            value={search}
            onChange={({ target: { value } }) => setSearch(value)}
            autoComplete="off"
          />
          <label htmlFor="floatingInput">Search {name}</label>
        </div>

        <DropdownItem divider />

        <form className="action-wrapper">
          {optionsToRendor().map(({ label, value }, i) => (
            <div
              style={{
                width: "100%",
                padding: ".8rem 1rem",
                position: "relative"
              }}
              className="option"
              key={`${value}${i}${label}`}
              onClick={() => {
                setData((s) =>
                  s.includes(value) ? s.filter((v) => v != value) : [...s, value]
                )
                inputRef.current?.focus()
                inputRef.current?.select()
              }}
            >
              <input
                type="checkbox"
                id={`${label}${i}`}
                className="form-check-input"
                style={{ backgroundSize: "70%" }}
                checked={data.includes(value)}
                readOnly
              />

              <label
                className="form-check-label filterLabel"
                htmlFor={`${label}${i}`}
                onClick={(e) => e.stopPropagation()}
              >
                {label}
              </label>
            </div>
          ))}
        </form>
        <div className="filter-actions">
          <Button
            color={`flat-${data.length ? "danger" : "secondary"}`}
            onClick={selectAllFilter}
          >
            {data.length ? "Clear All" : "Select All"}
          </Button>
          <Button
            color="flat-success"
            onClick={() => {
              onChange(data)
              setIsOpen(false)
            }}
          >
            Apply Filter
          </Button>
        </div>
      </DropdownMenu>
    </ButtonDropdown>
  )
}

export default MultiSelect

export type MultiSelectProps = Partial<{
  name: string
  options: OptionsType
  onChange: (value: string[]) => void
  value: string[]
  id: string
}>

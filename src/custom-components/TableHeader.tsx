import useFilter from "@hooks/useFilter"
import { TPaginationComponents } from "@src/types/common.type"
import { Input, Select } from "antd"
import { ReactNode } from "react"

type Props = {
  currentPage: TPaginationComponents
  children?: ReactNode
  countOptions?: number[]
}

const TableHeader = ({ currentPage, children, countOptions = [25, 50, 100] }: Props) => {
  const { setFilter, filter } = useFilter(currentPage)

  return (
    <div
      id={currentPage}
      className="d-flex align-items-center justify-content-between  mb-1"
    >
      <div className="d-flex align-items-center ">
        <label htmlFor="rows-per-page">Show</label>
        <Select
          id="count-dropdown"
          options={countOptions.map((label) => ({ label, value: label }))}
          optionRender={(d, { index }) => (
            <span id={`count-dropdown-${index}`}>{d.label}</span>
          )}
          value={filter.count}
          className="ms-1"
          onChange={(count) => setFilter({ count, page: 1 })}
          style={{ width: "4rem" }}
        />
      </div>
      <div className="d-flex align-items-center gap-1">
        <Input.Search
          placeholder="Search"
          allowClear
          id="search-box"
          onSearch={(searchTerm) => setFilter({ searchTerm, page: 1 })}
          style={{ width: 200 }}
          defaultValue={filter?.searchTerm ?? ""}
        />
        {children}
      </div>
    </div>
  )
}

export default TableHeader

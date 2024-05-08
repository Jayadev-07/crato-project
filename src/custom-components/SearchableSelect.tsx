import { Select, SelectProps } from "antd"

const SearchableSelect = (props: SelectProps) => {
  const id = props.id ?? "Select"
  return (
    <Select
      id={id}
      showSearch
      optionRender={(d, { index }) => <span id={`${id}-${index}`}>{d.label}</span>}
      filterOption={(input, option) =>
        ((option?.label ?? "") as string).toLowerCase().includes(input.toLowerCase())
      }
      {...props}
    />
  )
}

export default SearchableSelect

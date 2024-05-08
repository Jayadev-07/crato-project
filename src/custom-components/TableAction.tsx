import { EllipsisOutlined, LoadingOutlined } from "@ant-design/icons"
import { Dropdown, DropdownProps, MenuProps, Space, Spin } from "antd"
import { ReactNode } from "react"

const TableAction = (props: TProps) => {
  const { items, loading, onClick, children, id = "action", ...rest } = props
  if (loading)
    return <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
  return (
    <Dropdown menu={{ items, onClick }} trigger={["click"]} {...rest}>
      <a onClick={(e) => e.preventDefault()} id={id}>
        {children || (
          <Space>
            <EllipsisOutlined />
          </Space>
        )}
      </a>
    </Dropdown>
  )
}

export default TableAction

type TProps = DropdownProps & {
  loading: boolean
  id?: string
  items: MenuProps["items"]
  onClick: MenuProps["onClick"]
  children?: ReactNode
}

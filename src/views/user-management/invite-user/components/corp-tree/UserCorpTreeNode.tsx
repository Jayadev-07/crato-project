import { TUserCorpTree } from "."
import { InfoCircleOutlined, LockOutlined } from "@ant-design/icons"
import { Tooltip } from "antd"

const UserCorpTreeNode = (props: TUserCorpTree) => {
  if (props.isEnabled && props.isRestricted) return <>{props.title}</>
  const text = !props.isRestricted
    ? `${props.title} has no restrictions`
    : `Please choose a parent unit (${props.parentName ?? props.parentId})`
  return (
    <div className={!props.isRestricted ? "to-select" : ""}>
      {props.title}{" "}
      <Tooltip placement="top" title={text} arrow={{ pointAtCenter: true }}>
        {!props.isRestricted ? <InfoCircleOutlined /> : <LockOutlined />}
      </Tooltip>
    </div>
  )
}

export default UserCorpTreeNode

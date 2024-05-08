import { ExclamationCircleFilled } from "@ant-design/icons"
import onOk from "@utils/sessionExpireHandler"

import { Modal } from "antd"

const { warning } = Modal

const SessionExpireModal = () => {
  warning({
    centered: true,
    maskClosable: false,
    title: "Session expired",
    icon: <ExclamationCircleFilled />,
    content: "Your session is expired. Please login again",
    okText: "Go to login page",
    onOk,
    okButtonProps: { id: "login", className: "bg-primary" }
  })
}

export default SessionExpireModal

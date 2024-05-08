import { ExclamationCircleFilled } from "@ant-design/icons"
import onOk from "@utils/sessionExpireHandler"
import { Modal } from "antd"
import { useEffect } from "react"

const { confirm } = Modal
const IdleTimer = (props: TProps) => {
  const { children, onIdle = defaultIdle, timeout = inactivityTimeout } = props
  let timer: any
  const resetTimer = () => {
    if (timer) clearTimeout(timer)
  }
  const handleLogoutTimer = () => {
    if (!localStorage.getItem("accessToken")) return
    timer = setTimeout(() => {
      resetTimer()
      events.forEach((item) => {
        removeEventListener(item, resetTimer)
      })
      onIdle()
    }, timeout)
  }

  useEffect(() => {
    events.forEach((item) => {
      addEventListener(item, () => {
        resetTimer()
        handleLogoutTimer()
      })
    })
  }, [])

  return children
}

export default IdleTimer

const events: TEvents = ["load", "mousemove", "mousedown", "click", "scroll", "keypress"]
const inactivityTimeout = 4 * 60 * 60 * 1000 // 4 hours in milliseconds

const defaultIdle = () => {
  confirm({
    centered: true,
    maskClosable: false,
    title: "Session about to expire",
    icon: <ExclamationCircleFilled />,
    content:
      "You have been away for more than 4 hours. Please confirm if you want to stay",
    okText: "Leave",
    cancelText: "Stay",
    onOk,
    cancelButtonProps: { id: "Stay" },
    okButtonProps: { id: "leave", className: "bg-primary" }
  })
}
type TProps = { children: any; onIdle?: () => {}; timeout?: number }
type TEvents = (keyof WindowEventMap)[]

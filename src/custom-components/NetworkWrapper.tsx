import { Result } from "antd"
import { ReactNode, useEffect, useState } from "react"

const NetworkWrapper = ({ children }: { children: ReactNode }) => {
  const [isOnline, setOnline] = useState(true)

  useEffect(() => {
    setOnline(navigator.onLine)
  }, [])

  window.addEventListener("online", () => {
    setOnline(true)
  })

  window.addEventListener("offline", () => {
    setOnline(false)
  })

  // if user is online, return the child component else return a custom component
  if (isOnline) return children
  return (
    <Result
      status="500"
      title="No Internet"
      subTitle="You are not connected to the network."
      // extra={<Button type="primary">Back Home</Button>}
    />
  )
}

export default NetworkWrapper

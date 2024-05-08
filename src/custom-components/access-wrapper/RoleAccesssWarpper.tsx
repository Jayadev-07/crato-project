import { ReactNode, useContext } from "react"
import { PageContext } from "./PageWrapper"

const RoleAccesssWarpper = (prop: TProp) => {
  const { actionId, children } = prop
  const pageId = useContext(PageContext)
  const filteredData = data.find((d) => d.pageId == pageId)

  if (!filteredData) return <></>

  const hasAction = filteredData?.action.includes(actionId)
  const hasWriteAccess = filteredData?.acsess === "WRITE"

  if (!hasWriteAccess) return <></>
  if (!hasAction) return <></>
  return <div id={actionId}>{children}</div>
}

export default RoleAccesssWarpper
type TProp = {
  actionId: string
  children: ReactNode
}

const data = [{ pageId: "TEMP", acsess: "WRITE", action: ["POST", "SAVE"] }]

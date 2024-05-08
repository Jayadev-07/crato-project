import { Spin, Tabs } from "antd"
import PermissionDataTable from "./PermissionDataTable"
import useFetch from "@hooks/useFetch"
import getUrl from "@api/url"
import type { TabsProps } from "antd"
import type { TOptions } from "@src/types/common.type"
import type { TData, TPayload } from "."
import { useEffect } from "react"
import { payloadSignal as payload } from "."

const setPayload = (d: Partial<TPayload>) => {
  payload.value = { ...payload.value, ...d }
}

const Permissions = (props: TProp) => {
  const {
    title,
    baseRole,
    companyId,
    setLandingPageOption,
    editData,
    isEditPage,
    isCopyFrom,
    isDisabled
  } = props

  const [data, { loading }] = useFetch<TRolePermission>(
    getUrl("AUTHENTICATION_API", "AUTHENTICATION_ROLE_API", "ROLE_PERMISSIONS"),
    {
      apiParams: {
        params: { baseRoleId: baseRole, companyId }
      },
      noFetch: !isCopyFrom && !(baseRole && companyId)
    }
  )

  const payloadHandler = () => {
    const modulePermissions =
      data?.modulePermissions.map((d) => ({
        pageId: d.pageId,
        actions: d.actions.map((d) => d.value),
        access: "WRITE"
      })) ?? []
    const businessUserPrivileges =
      data?.businessUserPrivilege.map((d) => ({
        pageId: d.pageId,
        actions: d.actions.map((d) => d.value),
        approval: true,
        resolution: true
      })) ?? []
    setPayload({ modulePermissions, businessUserPrivileges })
  }

  const prefillHandler = () => {
    const modulePermissions = editData?.modulePermissions ?? []
    const businessUserPrivileges = editData?.businessUserPrivileges ?? []
    setPayload({ modulePermissions, businessUserPrivileges })
  }

  useEffect(() => {
    if (!data) return
    setLandingPageOption(data.landingPage)
    if (!isEditPage) payloadHandler()

    if (isEditPage && editData) prefillHandler()

    if (isCopyFrom && editData) prefillHandler()
  }, [data, editData])

  const filterHandler = ({ key }: any) => {
    if (key == "MODULES") return !!data?.modulePermissions?.length
    return !!data?.businessUserPrivilege?.length
  }
  const items: TabsProps["items"] = [
    {
      key: "MODULES",
      label: "Module Permissions",
      children: (
        <PermissionDataTable
          type="MODULE"
          isDisabled={isDisabled}
          baseRole={baseRole}
          data={data?.modulePermissions ?? []}
        />
      )
    },
    {
      key: "BUSINESS_USER",
      label: "Business User Previlages",
      children: (
        <PermissionDataTable
          isDisabled={isDisabled}
          type="BUSINESS_PREVILAGE"
          baseRole={baseRole}
          data={data?.businessUserPrivilege ?? []}
        />
      )
    }
  ].filter(filterHandler)

  if (!items.length) return <></>
  return (
    <>
      <Spin spinning={loading} size="large">
        <h4 style={{ padding: "1rem 0 0 0", margin: 0 }}>Permissions</h4>
        <p>{title}</p>
        <Tabs defaultActiveKey="MODULES" className="mt-1" items={items} />
      </Spin>
    </>
  )
}

export default Permissions

type TProp = {
  title: string
  companyId: string
  baseRole: string
  editData?: TData
  isEditPage: boolean
  isCopyFrom: boolean
  isDisabled: boolean
  setLandingPageOption: React.Dispatch<React.SetStateAction<TOptions>>
}
type TRolePermission = {
  businessUserPrivilege: TPermission[]
  modulePermissions: TPermission[]
  landingPage: TOptions
}
export type TPermission = {
  menu: string
  screen: string
  moduleId: string[]
  actions: TOptions
  pageId: number
}

import { Button, Form, Input, Spin, notification } from "antd"
import Permissions from "./Permissions"
import { Card, CardBody } from "reactstrap"
import useFetch from "@hooks/useFetch"
import getUrl from "@api/url"
import Breadcrumbs from "@custom-components/Breadcrumbs"
import { useEffect, useState } from "react"
import { signal } from "@preact/signals-react"
import type { TOptions } from "@src/types/common.type"
import usePost from "@hooks/usePost"
import { useNavigate, useParams } from "react-router-dom"
// import data from "./roleData"
import themeConfig from "@assets/data/themeConfig"
import CopyFromModal from "./CopyFromModal"
import SearchableSelect from "@custom-components/SearchableSelect"
import { getCompanyId } from "@utils/index"

const primary = themeConfig.color
export const payloadSignal = signal<TPayload>({
  businessUserPrivileges: [],
  modulePermissions: []
})

const AddRole = () => {
  const [show, setShow] = useState(false)
  const [isCopyFrom, setIsCopyFrom] = useState(false)

  const [form] = Form.useForm()
  const baseRoleId = Form.useWatch("baseRoleId", form)
  const companyId = Form.useWatch("companyId", form)
  const [landlingPageOption, setLandingPageOption] = useState<TOptions>([])
  const navigate = useNavigate()
  const { makeRequest: saveRole, isLoading } = usePost(
    getUrl("MASTER_DATA_API", "ROLE_API", "SAVE")
  )
  const { makeRequest: updateRole, isLoading: updating } = usePost(
    getUrl("MASTER_DATA_API", "ROLE_API", "UPDATE"),
    "put"
  )
  const { id } = useParams()
  const [isDisabled, setIsDisabled] = useState(!!id)

  const [data, { isFirstLoad }] = useFetch<TData>(
    getUrl("MASTER_DATA_API", "ROLE_API", "GET") + `/${id}`,
    {
      noFetch: !id,
      onError: (e) => {
        notification.error({ message: e?.message })
        navigate(-1)
      }
    }
  )
  const {
    makeRequest: getRoleById,
    isLoading: copyFromLoading,
    data: copyFromData
  } = usePost<TData>()

  const [baseRoleList = []] = useFetch<TBaseRoleOptions>(
    getUrl("AUTHENTICATION_API", "AUTHENTICATION_ROLE_API", "BASE_ROLE_LABEL_VALUE")
  )

  const [companyList] = useFetch<TOptions>(
    getUrl("MASTER_DATA_API", "COMPANY_PROFILE", "GET_ALL_COMPANIES")
  )
  const onSubmit = async (payload: any) => {
    const value = {
      ...payload,
      ...payloadSignal.value,
      active: true,
      ...(id ? { roleId: data?.roleId } : {})
    }
    const res = await (id ? updateRole : saveRole)({ data: value })
    notification.success({ message: res.message ?? "Saved successfully" })
    navigate(-1)
  }
  const canViewPermission = baseRoleId && companyId

  const getTitle = () => {
    return baseRoleList.find(({ value }) => value == baseRoleId)?.description ?? ""
  }

  const onCopyFromSubmit = async (data: any) => {
    const res = await getRoleById({
      url: getUrl("MASTER_DATA_API", "ROLE_API", "GET") + `/${data.roleId}`,
      method: "get"
    })
    form.setFieldValue("baseRoleId", res?.baseRoleId)
    form.setFieldValue("companyId", res?.companyId)
    form.setFieldValue("landingPage", res?.landingPage)

    setIsCopyFrom(true)
    setShow(false)
  }

  useEffect(() => {
    if (!data) return
    form.setFieldValue("roleName", data.roleName)
    form.setFieldValue("companyId", data.companyId)
    form.setFieldValue("baseRoleId", data.baseRoleId)
    form.setFieldValue("landingPage", data.landingPage)
  }, [data])
  const header = id ? "Edit Role" : "Add Role"
  const breadCrumb = id ? editRoleBreadCrumb : createRoleBreadCrumb

  return (
    <>
      <CopyFromModal
        show={show}
        setShow={setShow}
        companyList={companyList}
        onSubmit={onCopyFromSubmit}
        loading={copyFromLoading}
      />
      <Breadcrumbs
        withGoBack
        data={[...breadcrumbData, ...breadCrumb]}
        title={id ? "Edit Role" : "Create Role"}
      />
      <Card>
        <CardBody>
          <Spin spinning={isFirstLoad && !!id} size="large">
            <div className="d-flex justify-content-between align-items-center">
              <h3 className="mb-1">{header}</h3>
              <Button
                type="primary"
                id="save-role"
                loading={isLoading || updating}
                onClick={() => (isDisabled ? setIsDisabled(false) : form.submit())}
              >
                {isDisabled ? "Edit" : "Save"}
              </Button>
            </div>
            <Form
              name="role"
              disabled={isDisabled}
              form={form}
              onFinish={onSubmit}
              initialValues={{ companyId: getCompanyId() }}
            >
              <div>
                <div className="d-flex">
                  <Form.Item
                    label="Role Name"
                    name="roleName"
                    rules={[{ required: true, max: 15 }]}
                  >
                    <Input style={{ width: "30rem" }} />
                  </Form.Item>
                  <Button
                    style={{ color: primary }}
                    onClick={() => setShow(true)}
                    type="link"
                    id="copy-from"
                  >
                    Copy From
                  </Button>
                </div>
                <div className="d-flex">
                  <Form.Item
                    label="Base Role"
                    name="baseRoleId"
                    rules={[{ required: true }]}
                  >
                    <SearchableSelect
                      options={baseRoleList}
                      id="baseRoleId"
                      style={{ width: "15rem", marginRight: "1rem" }}
                    />
                  </Form.Item>
                  <Form.Item
                    label="Company Name"
                    name="companyId"
                    rules={[{ required: true }]}
                  >
                    <SearchableSelect
                      options={companyList}
                      id="companyId"
                      style={{ width: "15rem", marginRight: "1rem" }}
                    />
                  </Form.Item>
                  <Form.Item
                    label="Landing Page"
                    name="landingPage"
                    rules={[{ required: true }]}
                  >
                    <SearchableSelect
                      id="landingPage"
                      options={landlingPageOption}
                      style={{ width: "15rem" }}
                    />
                  </Form.Item>
                </div>
              </div>
            </Form>
            {canViewPermission && (
              <Permissions
                isDisabled={isDisabled}
                setLandingPageOption={setLandingPageOption}
                baseRole={baseRoleId}
                companyId={companyId}
                editData={data ?? copyFromData}
                isEditPage={!!id}
                isCopyFrom={isCopyFrom}
                title={getTitle()}
              />
            )}
          </Spin>
        </CardBody>
      </Card>
    </>
  )
}

export default AddRole

const breadcrumbData = [
  { link: "", title: "Profile" },
  { link: "/role-management", title: "Role Management" }
]

const createRoleBreadCrumb = [{ link: "", title: "Create Role" }]
const editRoleBreadCrumb = [{ link: "", title: "Edit Role" }]
type TBaseRoleOptions = {
  label: string
  value: string
  description: string
}[]

export type TPayload = {
  modulePermissions: TModule[]
  businessUserPrivileges: TBUPrevileges[]
}
export type TModule = {
  pageId: number
  access: string
  actions: string[]
}
export type TBUPrevileges = {
  actions: string[]
  pageId: number
  approval: boolean
  resolution: boolean
}

export type TData = {
  roleId: string
  roleName: string
  baseRoleId: string
  companyId: string
  landingPage: string
  active: boolean
} & TPayload

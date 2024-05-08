import { Form, Select, notification } from "antd"
import useFetch from "@hooks/useFetch"
import getUrl from "@api/url"
import { DefaultOptionType } from "antd/es/select"
import { TSelectedCompany } from "../.."
import UserInviteWrapper from "./UserInviteWrapper"
import usePost from "@hooks/usePost"
import useFilter from "@hooks/useFilter"
import { TOptions } from "@src/types/common.type"
// import { getCompanyId } from "@utils/index"
type Props = {
  selectedCompanies: TSelectedCompany[]
  setSelectedCompanies: React.Dispatch<React.SetStateAction<TSelectedCompany[]>>
}
const UserInviteAddCompany = ({ selectedCompanies, setSelectedCompanies }: Props) => {
  const [form] = Form.useForm()
  const companyId = Form.useWatch("companyId", form)
  const { filter, setFilter } = useFilter("USER_CORP_FILTER")

  const [companyList] = useFetch<DefaultOptionType[]>(
    getUrl("MASTER_DATA_API", "COMPANY_PROFILE", "GET_ALL_COMPANIES")
  )
  const { makeRequest, isLoading } = usePost(
    getUrl("MASTER_DATA_API", "USER_CORP", "DELTA"),
    "post"
  )
  const [roleList, { loading }] = useFetch<TOptions>(
    getUrl("MASTER_DATA_API", "ROLE_API", "LABEL_VALUE"),
    {
      apiParams: { params: { companyId } },
      noFetch: !companyId
    }
  )

  const handleSubmit = async (data: TSelectedCompany) => {
    const companyName = companyList?.find((c) => c.value == data.companyId)?.label
    const roleName = roleList?.find((c) => c.value == data.roleId)?.label
    const { deltaId } = await makeRequest({
      params: {
        companyId: data.companyId,
        ...(filter.deltaId ? { deltaId: filter.deltaId } : {})
      }
    })
    setFilter({
      list: [...(filter.list ?? []), { companyId: data.companyId, page: 1, count: 50 }],
      ...(filter.deltaId ? {} : { deltaId })
    })
    notification.success({ message: "Company added successfully" })
    setSelectedCompanies((s) => [
      ...s,
      { ...data, companyName, roleName, key: data.companyId }
    ])
    form.resetFields()
    // toggle()
  }

  return (
    <>
      <UserInviteWrapper
        modal={!!selectedCompanies.length}
        form={form}
        isLoading={isLoading}
      >
        <Form layout="vertical" form={form} onFinish={handleSubmit}>
          <Form.Item name="companyId" label="Company" rules={[{ required: true }]}>
            <Select
              options={companyList?.filter(
                (s: any) =>
                  !selectedCompanies.map(({ companyId }) => companyId).includes(s?.value)
              )}
            />
          </Form.Item>
          <Form.Item name="roleId" label="Role" rules={[{ required: true }]}>
            <Select
              options={roleList}
              disabled={!companyId && !loading}
              loading={loading}
            />
          </Form.Item>
        </Form>
      </UserInviteWrapper>
    </>
  )
}

export default UserInviteAddCompany

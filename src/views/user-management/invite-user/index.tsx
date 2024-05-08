import { Button, Form, Input, notification } from "antd"
import { useState } from "react"
import UserCorpCompanyList from "./components/UserCorpCompanyList"
import Breadcrumbs from "@custom-components/Breadcrumbs"
import { Card, CardBody } from "reactstrap"
import UserInviteAddCompany from "./components/user-invite-add-company/UserInviteAddCompany"
import usePost from "@hooks/usePost"
import getUrl from "@api/url"
import useFilter from "@hooks/useFilter"
import { useNavigate } from "react-router-dom"

const InviteUser = () => {
  const [selectedCompanies, setSelectedCompanies] = useState<TSelectedCompany[]>([])
  const { makeRequest, isLoading } = usePost(
    getUrl("AUTHENTICATION_API", "CRATO_USER", "INVITE_USER"),
    "post"
  )
  const navigate = useNavigate()
  const { filter, resetFilter } = useFilter("USER_CORP_FILTER")
  console.log(selectedCompanies)

  const onSubmit = async ({ email }: { email: string }) => {
    console.log(email)
    const data = {
      userName: email,
      deltaID: filter.deltaId,
      userCompanyMappings: selectedCompanies.map((s) => ({
        companyId: s.companyId,
        roleId: s.roleId
      }))
    }
    console.log(data)
    // return
    await makeRequest({ data })
    notification.success({ message: "User Invited successfully" })
    resetFilter()
    navigate(-1)
  }
  return (
    <section id="invite-user">
      <Breadcrumbs
        title="Invite User"
        data={[
          { link: "/user-management", title: "User Management" },
          { title: "Invite User" }
        ]}
        withGoBack
      />
      <Card>
        <CardBody>
          <Form layout="vertical" onFinish={onSubmit}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true },
                { type: "email", message: "Please enter a valid Email" }
              ]}
            >
              <Input />
            </Form.Item>

            <UserInviteAddCompany
              setSelectedCompanies={setSelectedCompanies}
              selectedCompanies={selectedCompanies}
            />
            <UserCorpCompanyList
              setSelectedCompanies={setSelectedCompanies}
              selectedCompanies={selectedCompanies}
            />
            {!!selectedCompanies.length && (
              <Button
                style={{ float: "right" }}
                type="primary"
                htmlType="submit"
                loading={isLoading}
              >
                Send Invite
              </Button>
            )}
          </Form>
        </CardBody>
      </Card>
    </section>
  )
}

export default InviteUser
export type TSelectedCompany = {
  companyName?: any
  companyId: string
  roleName?: any
  roleId: string
}

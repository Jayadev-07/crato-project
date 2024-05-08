import { TSelectedCompany } from "@views/user-management/invite-user"
import { Button, Card, Spin, Table, TableColumnsType } from "antd"
import { useState } from "react"
import CorpModal from "./CorpModal"
import useFilter from "@hooks/useFilter"
import useFetch from "@hooks/useFetch"
import getUrl from "@api/url"
import { getEmailId } from "@utils/index"
import { useParams } from "react-router-dom"

const AccountTab = () => {
  const userEmail = useParams()?.email ?? getEmailId()

  const [activeCompany, setActiveCompany] = useState<TSelectedCompany | null>(null)
  const { filter, setFilter } = useFilter("USER_CORP_FILTER")
  const onView = async (record: TSelectedCompany) => {
    setFilter({
      list: [...filter.list, { companyId: record?.companyId ?? "", page: 1, count: 50 }]
    })
    setActiveCompany(record)
  }
  const [selectedCompanies = [], { loading }] = useFetch(
    `${getUrl(
      "MASTER_DATA_API",
      "TENANT_USER",
      "COMPANY_ROLE_INFO_USERNAME"
    )}/${userEmail}`,
    { callback: (s) => s.map((s: TSelectedCompany) => ({ ...s, key: s.companyId })) }
  )

  const columns: TableColumnsType<TSelectedCompany> = [
    { title: "Company Name", dataIndex: "companyName", key: "companyName" },
    { title: "Role", dataIndex: "roleName", key: "roleName" },
    {
      title: "Action",
      dataIndex: "",
      key: "x",
      render: (_, record) => (
        <>
          <Button type="link" className="txt-primary" onClick={() => onView(record)}>
            View
          </Button>
        </>
      )
    }
  ]
  if (!selectedCompanies.length) return <></>
  return (
    <Card>
      <CorpModal
        activeCompany={activeCompany}
        setActiveCompany={setActiveCompany}
        key={activeCompany?.companyId}
      />
      <Spin spinning={loading}>
        <Table columns={columns} dataSource={selectedCompanies} pagination={false} />
      </Spin>
    </Card>
  )
}
export default AccountTab

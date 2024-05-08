import { Button, Table } from "antd"
import type { TableColumnsType } from "antd"
import { TSelectedCompany } from ".."
import UserCorpTree from "./corp-tree"
import { useState } from "react"
import usePost from "@hooks/usePost"
import getUrl from "@api/url"
import useFilter from "@hooks/useFilter"
type Props = {
  selectedCompanies: TSelectedCompany[]
  setSelectedCompanies: React.Dispatch<React.SetStateAction<TSelectedCompany[]>>
}

const UserCorpCompanyList = ({ selectedCompanies, setSelectedCompanies }: Props) => {
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([])
  const { filter, setFilter } = useFilter("USER_CORP_FILTER")
  const { makeRequest, isLoading } = usePost(
    getUrl("MASTER_DATA_API", "USER_CORP", "DELTA_DELETE_COMPANY"),
    "put",
    { successToast: true }
  )
  const onDelete = async (record: TSelectedCompany) => {
    await makeRequest({
      params: { companyId: record.companyId, deltaId: filter.deltaId }
    })
    setSelectedCompanies((s) => s.filter((x) => record.companyId != x.companyId))
    setFilter({ list: filter.list.filter((s) => s.companyId != record.companyId) })
  }
  const columns: TableColumnsType<TSelectedCompany> = [
    { title: "Company Name", dataIndex: "companyName", key: "companyName" },
    { title: "Role", dataIndex: "roleName", key: "roleName" },
    {
      title: "Action",
      dataIndex: "",
      key: "x",
      render: (_, record) => (
        <Button
          danger
          type="text"
          onClick={() => onDelete(record)}
          loading={isLoading}
          id="delete-company"
        >
          {isLoading ? "Deleting" : "Delete"}
        </Button>
      )
    }
  ]
  if (!selectedCompanies.length) return <></>
  return (
    <Table
      columns={columns}
      expandable={{
        expandedRowRender: (record) => <UserCorpTree companyId={record.companyId} />,
        expandedRowKeys,
        onExpand: (_, record) =>
          setExpandedRowKeys((s) =>
            s.includes(record.companyId) ? [] : [record.companyId]
          )
      }}
      dataSource={selectedCompanies}
    />
  )
}

export default UserCorpCompanyList

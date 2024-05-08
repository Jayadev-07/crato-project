import Breadcrumbs from "@custom-components/Breadcrumbs"
import ConnectedBanks from "./ConnectedBanks"
import AntPagination from "@custom-components/AntPagination"
import SearchableSelect from "@custom-components/SearchableSelect"
import TableHeader from "@custom-components/TableHeader"
import SkeletonWrapper from "@custom-components/skeleton/SkeletonWrapper"
import TableSkeleton from "@custom-components/skeleton/TableSkeleton"
import { Card, Table, Tooltip } from "antd"
import Column from "antd/es/table/Column"
import { Badge, CardBody } from "reactstrap"
import data from "./account-list.json"
import EditAcctData from "./EditAcctData"
import { useState } from "react"

const BankingIntegration = () => {

  const [open, setOpen] = useState(false)
  const [dataValue, setDataValue]=useState<TBankDetail>({} as TBankDetail)
  const bankData=(data:any)=>{
    console.log(data)
    setOpen(true)
    setDataValue(data)
  }
  return (
    <>
      <Breadcrumbs withGoBack title="Bank Integration" data={breadCrumb} />
      <ConnectedBanks />
      <section className="mt-2">
        <h3>List of Linked accounts</h3>
        <h5>View and Edit all your linked accounts individually from the below table</h5>
        <Card>
          <CardBody>
            <SkeletonWrapper loading={false} skeleton={<TableSkeleton />}>
              <TableHeader currentPage="USER_MANAGEMENT">
                <div>
                  Filter:
                  <SearchableSelect id="bank-list" style={{ width: "100px" }} />
                </div>
              </TableHeader>
              <Table
                dataSource={data}
                pagination={false}
                style={{ overflowX: "auto" }}
                onRow={(data, index) => ({
                  id: `bank-item-${index}`,
                  style: { cursor: "pointer" },
                  onClick: () => bankData(data)
                })}
              >
                <Column title="INSTITUTION" dataIndex="institution" key="institution" />
                <Column title="ACCT NUMBER" dataIndex="acctNumber" key="acctNumber" />
                <Column title="ACCT NATIVE" dataIndex="acctNature" key="acctNature" />
                <Column title="ACCT TYPE" dataIndex="acctType" key="acctType" />
                <Column
                  title="GL ACCOUNT"
                  dataIndex="glAccount"
                  key="glAccount"
                  render={(value) => (
                    <Tooltip placement="topLeft" title={value}>
                      {value}
                    </Tooltip>
                  )}
                />
                <Column
                  title="STATUS"
                  dataIndex="status"
                  key="status"
                  render={(value) => (
                    <Badge color={value === "active" ? "light-primary" : "light-danger"}>
                      {value === "active" ? "Active" : "Inactive"}
                    </Badge>
                  )}
                />
              </Table>
              <AntPagination totalCount={0} currentPage="USER_MANAGEMENT" />
            </SkeletonWrapper>
          </CardBody>
        </Card>
      </section>
      <EditAcctData open={open} setOpen={setOpen} dataValue={dataValue} setDataValue={setDataValue}/>
    </>
  )
}

export default BankingIntegration

const breadCrumb = [
  { title: "Settings", link: "/settings" },
  { title: "Integration", link: "" },
  { title: "Banking Integration", link: "" }
]

export type TBankDetail = {
  id: number
  institution: string
  acctNumber: string
  acctNature: string
  acctType: string
  glAccount: string
  status: string
}
import { PlusOutlined } from "@ant-design/icons"
import getUrl from "@api/url"
import AntPagination from "@custom-components/AntPagination"
import TableHeader from "@custom-components/TableHeader"
import FilterWrapper from "@custom-components/FilterWrapper"
import PopupFilter from "@custom-components/popup-filter"
import SkeletonWrapper from "@custom-components/skeleton/SkeletonWrapper"
import TableSkeleton from "@custom-components/skeleton/TableSkeleton"
import useFetch from "@hooks/useFetch"
import useFilter from "@hooks/useFilter"
import { TOptions, TPaginationType } from "@src/types/common.type"
import { Button, Table } from "antd"
import { Card, CardBody } from "reactstrap"
import { Link, useNavigate } from "react-router-dom"
import Breadcrumbs from "@custom-components/Breadcrumbs"

const UserManagement = () => {
  const { filter, setFilter } = useFilter("USER_MANAGEMENT")
  const navigate = useNavigate()

  const [companyList] = useFetch<TOptions>(
    getUrl("MASTER_DATA_API", "COMPANY_PROFILE", "GET_ALL_COMPANIES")
  )

  const [res, { isFirstLoad, loading }] = useFetch<TPaginationType<TUser>>(
    getUrl("MASTER_DATA_API", "TENANT_USER", "USER_LIST"),
    {
      apiParams: {
        method: "POST",
        data: filter
      }
    }
  )

  const onRowClick = (email: string) => navigate(`./${email}`)
  return (
    <section>
      <Breadcrumbs data={breadcrumbData} title="User Management" withGoBack />
      <FilterWrapper page="USER_MANAGEMENT">
        <PopupFilter
          type="single"
          options={companyList}
          name="Company"
          value={filter.companyIds?.[0] ?? ""}
          onChange={(e: any) => setFilter({ companyIds: [e] })}
        />
        <PopupFilter
          type="multi"
          options={statusOptions}
          name="Status"
          value={filter.status ?? []}
          onChange={(e: any) => setFilter({ status: e })}
        />
      </FilterWrapper>
      <Card>
        <CardBody>
          <SkeletonWrapper loading={isFirstLoad} skeleton={<TableSkeleton />}>
            <div className="m-1">
              <TableHeader countOptions={[50, 100, 250, 500]} currentPage="GL_ACCOUNT">
                <Link to={"./invite-user"}>
                  <Button
                    type="primary"
                    id="add-user"
                    icon={<PlusOutlined />}
                    // onClick={() => setOpen(true)}
                  >
                    Add New User
                  </Button>
                </Link>
              </TableHeader>

              <Table
                id="users-list"
                loading={loading}
                onRow={(data: any, index) => ({
                  id: `user-item-${index}`,
                  style: { cursor: "pointer" },
                  onClick: () => onRowClick(data.email)
                })}
                columns={columns}
                dataSource={res?.list ?? []}
                pagination={false}
              />
              <AntPagination
                isLoading
                totalCount={res?.totalCount ?? 0}
                currentPage="USER_MANAGEMENT"
              />
            </div>
          </SkeletonWrapper>
        </CardBody>
      </Card>
    </section>
  )
}

export default UserManagement

type TUser = {
  userName: string
  lastName: string
  firstName: string
  userStatus: string
}

const statusOptions: TOptions = [
  {
    label: "Active",
    value: "ACTIVE"
  },
  {
    label: "Inactive",
    value: "IN_ACTIVE"
  },
  {
    label: "Invited",
    value: "INVITED"
  }
]

const columns: any = [
  {
    title: "EMAIL ID",
    dataIndex: "email",
    key: "email"
  },
  {
    title: "FIRST NAME",
    dataIndex: "firstName",
    key: "firstName"
  },
  {
    title: "LAST NAME",
    dataIndex: "lastName",
    key: "lastName"
  },
  {
    title: "ROLE",
    dataIndex: "role",
    key: "role"
  },
  {
    title: "STATUS",
    dataIndex: "userStatus",
    key: "userStatus"
  }
]

const breadcrumbData = [
  { link: "", title: "Profile" },
  { link: "", title: "User Management" }
]

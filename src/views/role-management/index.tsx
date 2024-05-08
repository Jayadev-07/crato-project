import Filter from "./Filter"
import useFetch from "@hooks/useFetch"
import getUrl from "@api/url"
import useFilter from "@hooks/useFilter"
import { MODAL_ERROR_CODE, removeEmpty } from "@utils/index"
import type { TPaginationType } from "@src/types/common.type"
import SkeletonWrapper from "@custom-components/skeleton/SkeletonWrapper"
import { Button, MenuProps, Modal, Table, notification } from "antd"
import Column from "antd/es/table/Column"
import TableHeader from "@custom-components/TableHeader"
import { Badge, Card, CardBody } from "reactstrap"
import AntPagination from "@custom-components/AntPagination"
import { useNavigate } from "react-router-dom"
import TableSkeleton from "@custom-components/skeleton/TableSkeleton"
import Breadcrumbs from "@custom-components/Breadcrumbs"
import usePost from "@hooks/usePost"
import { useState } from "react"
import { ExclamationCircleFilled } from "@ant-design/icons"
import TableAction from "@custom-components/TableAction"

const { confirm } = Modal
const RoleManagementList = () => {
  const { filter } = useFilter("ROLE_LIST")
  const gotTo = useNavigate()
  const [updating, setUpdating] = useState({
    roleId: "",
    loading: false
  })

  const { makeRequest: updateRole } = usePost(
    getUrl("MASTER_DATA_API", "ROLE_API", "UPDATE"),
    "put",
    { successToast: true, errorToast: false }
  )
  const { makeRequest: deleteRole } = usePost(undefined, "delete", {
    successToast: true,
    errorToast: false
  })

  const [data = { list: [], totalCount: 0 }, { loading, isFirstLoad, refetch }] =
    useFetch<TRoleList>(getUrl("MASTER_DATA_API", "ROLE_API", "FILTER"), {
      apiParams: { method: "post", data: removeEmpty({ ...filter }) },
      callback: ({ list, totalCount }) => ({
        list: list.map((d: any, id: number) => ({
          ...d,
          key: id
        })),
        totalCount
      })
    })

  const error = (title: string, content: string) => {
    Modal.error({
      title,
      content,
      centered: true,
      maskClosable: false,
      okText: "Okay",
      okButtonProps: { id: "Okay", className: "bg-primary" }
    })
  }

  const activeInactiveHandler = async (value: any) => {
    try {
      setUpdating({ roleId: value.roleId, loading: true })
      await updateRole({
        data: { roleId: value.roleId, active: !value.active }
      })
      refetch()
    } catch (e: any) {
      const message = e.message
      if (e.statusCode == MODAL_ERROR_CODE) error("Cannot Deactivate this role", message)
      else notification.error({ message })
    } finally {
      setUpdating({ roleId: "", loading: false })
    }
  }

  const ondelete = async (record: any) => {
    try {
      await deleteRole({
        url: getUrl("MASTER_DATA_API", "ROLE_API", "DELETE") + `/${record.roleId}`
      })
      await refetch()
    } catch (e: any) {
      const message = e.message
      if (e.statusCode == MODAL_ERROR_CODE) error("Cannot Delete this role", message)
      else notification.error({ message })
    }
  }

  const deleteHandler = async (record: any) => {
    confirm({
      centered: true,
      maskClosable: false,
      title: "Deactivation / Delete Confirmation",
      icon: <ExclamationCircleFilled />,
      content:
        "Are you sure to delete this role? You cannot use this role to any users as the role and permissions cannot be retrived",
      okText: "Yes",
      cancelText: "No",
      cancelButtonProps: { id: "no" },
      okButtonProps: { id: "yes", className: "bg-primary" },
      onOk: async () => await ondelete(record)
    })
  }

  const onRowClick = (id: string) => {
    gotTo(`/edit-role/${id}`)
  }

  const getItems = (value: boolean, id: number): MenuProps["items"] => {
    return [
      {
        label: (
          <span id={`${value ? "Deactivate" : "Activate"}-${id}`}>
            {value ? "Deactivate" : "Activate"}
          </span>
        ),
        key: "STATUS"
      },
      {
        label: <span id={`Delete-${id}`}>Delete</span>,
        key: "DELETE"
      }
    ]
  }

  return (
    <>
      <Breadcrumbs withGoBack title="Role Management" data={breadcrumbData} />
      <Filter />
      <Card>
        <CardBody>
          <SkeletonWrapper loading={isFirstLoad} skeleton={<TableSkeleton />}>
            <TableHeader currentPage="ROLE_LIST">
              <Button
                type="primary"
                id="create-role-btn"
                onClick={() => gotTo("/create-role")}
              >
                Create Role
              </Button>
            </TableHeader>
            <Table
              id="role-list"
              loading={loading}
              dataSource={data.list ?? []}
              pagination={false}
              onRow={(data, index) => ({
                id: `role-item-${index}`,
                style: { cursor: "pointer" },
                onClick: () => onRowClick(data.roleId)
              })}
            >
              <Column title="Role Name" dataIndex="roleName" key="roleName" />
              <Column title="Base Role" dataIndex="baseRoleId" key="baseRoleId" />
              <Column
                title="Status"
                dataIndex="active"
                key="active"
                render={(value) => (
                  <Badge color={value ? "light-primary" : "light-danger"}>
                    {value ? "Active" : "Inactive"}
                  </Badge>
                )}
              />
              <Column
                width={100}
                title={<span>Action</span>}
                dataIndex="active"
                key="X"
                render={(value, record: any, id) => (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <TableAction
                      loading={updating.roleId == record.roleId && updating.loading}
                      items={getItems(value, id)}
                      id="action"
                      onClick={({ key }) =>
                        key == "STATUS"
                          ? activeInactiveHandler(record)
                          : deleteHandler(record)
                      }
                    />
                  </div>
                )}
              />
            </Table>
            <AntPagination totalCount={data.totalCount} currentPage="ROLE_LIST" />
          </SkeletonWrapper>
        </CardBody>
      </Card>
    </>
  )
}

export default RoleManagementList

const breadcrumbData = [
  { link: "", title: "Profile" },
  { link: "", title: "Role Management" }
]
type TRoleList = TPaginationType<{
  roleName: string
  baseRoleId: string
  companyId: string
  active: boolean
  roleId: string
}>

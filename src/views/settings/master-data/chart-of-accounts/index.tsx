import { useState } from "react"
import AddUpdateGl from "./AddUpdateGl"
import TableHeader from "@custom-components/TableHeader"
import { Button, Dropdown, Space, Spin, Table, notification } from "antd"
import { Card, Badge } from "reactstrap"
import useFetch from "@hooks/useFetch"
import { TPaginationType } from "@src/types/common.type"
import useFilter from "@hooks/useFilter"
import { getCompanyId } from "@utils/index"
import getUrl from "@api/url"
import AntPagination from "@custom-components/AntPagination"
import { EllipsisOutlined, LoadingOutlined, PlusOutlined } from "@ant-design/icons"
import Breadcrumbs from "@custom-components/Breadcrumbs"
import usePost from "@hooks/usePost"
import TableSkeleton from "@custom-components/skeleton/TableSkeleton"
import StatusConfirmModal from "./StatusConfirmModal"
import SkeletonWrapper from "@custom-components/skeleton/SkeletonWrapper"

const ChartOfAccounts = () => {
  const { filter } = useFilter("GL_ACCOUNT")

  const [open, setOpen] = useState(false)
  const [editGl, setEditGl] = useState<TGlAccountLite | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  const { makeRequest: updateGlStatus, isLoading: isGlUpdating } = usePost(
    getUrl("MASTER_DATA_API", "COA", "UPDATE_STATUS"),
    "put"
  )

  const onClose = () => {
    setOpen(false)
    if (editGl) setEditGl(null)
  }

  const [res, { refetch, isFirstLoad }] = useFetch<TPaginationType<TGlAccountLite>>(
    getUrl("MASTER_DATA_API", "COA", "FILTER"),
    {
      apiParams: {
        method: "POST",
        data: {
          ...filter,
          companyIds: [getCompanyId()]
        }
      },
      callback: (data: TPaginationType<TGlAccountLite>) => {
        return {
          list: data.list.map((v, i) => {
            return { ...v, key: i }
          }),
          totalCount: data.totalCount
        }
      }
    }
  )

  const columns: any["columns"] = [
    {
      title: "GL CODE",
      dataIndex: "glCode",
      key: "glCode"
    },
    {
      title: "GL NAME",
      dataIndex: "glName",
      key: "glName"
    },
    {
      title: "GL TYPE",
      dataIndex: "glType",
      key: "glType"
    },
    {
      title: "DESCRIPTION",
      dataIndex: "description",
      key: "description"
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Badge color={status === "Active" ? "light-primary" : "light-danger"}>
          {status ?? ""}
        </Badge>
      )
    },
    {
      key: "options",
      render: (e: any) =>
        isGlUpdating && e.glId === updatingId ? (
          <Spin indicator={<LoadingOutlined style={{ fontSize: 18 }} spin />} />
        ) : (
          <Dropdown
            trigger={["click"]}
            menu={{
              items: [
                {
                  key: "1",
                  label: (
                    <div
                      id="edit-gl"
                      onClick={() => {
                        setOpen(true)
                        setEditGl(e)
                      }}
                    >
                      Edit
                    </div>
                  )
                },
                {
                  key: 2,
                  label: (
                    <div
                      id="gl-status-update"
                      onClick={() => {
                        if (e.status === "Active") {
                          setIsModalOpen(true)
                          setUpdatingId(e.glId)
                          return
                        }
                        handleUpdateStatus(
                          e.glId,
                          e.status === "Inactive" ? "ACTIVE" : "INACTIVE"
                        )
                      }}
                    >
                      {e.status === "Inactive" ? "Active" : "Inactive"}
                    </div>
                  )
                }
              ]
            }}
          >
            <Space>
              <EllipsisOutlined />
            </Space>
          </Dropdown>
        )
    }
  ]

  const handleUpdateStatus = async (glId: string, status: string) => {
    setUpdatingId(glId)
    await updateGlStatus(
      {
        data: {},
        params: { status }
      },
      glId
    )
    refetch()
    setUpdatingId(null)
    notification.success({ message: "GL account updated successfully" })
    if (isModalOpen) setIsModalOpen(false)
  }
  if (isFirstLoad)
    return (
      <Card className="px-1">
        <TableSkeleton />
      </Card>
    )
  return (
    <div id="chart-of-account">
      <Breadcrumbs withGoBack title="Chart of Accounts" data={breadCrumb} />
      <SkeletonWrapper loading={isFirstLoad} skeleton={<TableSkeleton />}>
        <Card>
          <div className="m-1">
            <TableHeader currentPage="GL_ACCOUNT">
              <Button
                type="primary"
                id="create-gl"
                icon={<PlusOutlined />}
                onClick={() => setOpen(true)}
              >
                Add Account
              </Button>
            </TableHeader>
            <Table
              columns={columns}
              onRow={(_: TGlAccountLite, index) => ({ id: `gl-${index}` })}
              dataSource={res?.list ?? []}
              pagination={false}
            />
            <AntPagination
              isLoading
              totalCount={res?.totalCount ?? 0}
              currentPage="CORP_STRUTURE"
            />
          </div>
        </Card>
      </SkeletonWrapper>
      <AddUpdateGl open={open} onClose={onClose} glDetails={editGl} refetch={refetch} />
      <StatusConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        loading={isGlUpdating}
        handleStatusUpdate={() => handleUpdateStatus(updatingId ?? "", "INACTIVE")}
      />
    </div>
  )
}

export default ChartOfAccounts

const breadCrumb = [
  { title: "Settings", link: "/settings" },
  { title: "Master Data", link: "" },
  { title: "Chart of Accounts", link: "" }
]
export type TGlAccountLite = {
  glId: string
  companyId: string
  glCode: string
  glName: string
  description?: string
  glType: String
  status: String
  key: Number
}

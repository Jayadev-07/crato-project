import { EditOutlined } from "@ant-design/icons"
import getUrl from "@api/url"
import useFetch from "@hooks/useFetch"
import useFilter from "@hooks/useFilter"
import usePost from "@hooks/usePost"
import { TOptions } from "@src/types/common.type"
import { getEmailId } from "@utils/index"
import { TSelectedCompany } from "@views/user-management/invite-user"
import UserCorpTree from "@views/user-management/invite-user/components/corp-tree"
import { Button, Form, Modal, Select } from "antd"
import React, { useState } from "react"
import { useParams } from "react-router-dom"
import { isfromUserProfileSignal } from ".."

type Props = {
  activeCompany: TSelectedCompany | null
  setActiveCompany: React.Dispatch<React.SetStateAction<TSelectedCompany | null>>
}

const CorpModal = ({ activeCompany, setActiveCompany }: Props) => {
  const userEmail = useParams()?.email ?? getEmailId()

  const { filter, resetFilter, setFilter } = useFilter("USER_CORP_FILTER")
  const [roleId, setRoleId] = useState(activeCompany?.roleId)
  const [editMode, setEditMode] = useState(false)
  const [roleList, { loading }] = useFetch<TOptions>(
    getUrl("MASTER_DATA_API", "ROLE_API", "LABEL_VALUE"),
    {
      apiParams: { params: { companyId: activeCompany?.companyId } },
      noFetch: !activeCompany?.companyId
    }
  )
  const { makeRequest } = usePost(
    getUrl("MASTER_DATA_API", "TENANT_USER", "USER_COMPANY_ROLE_INFO"),
    "put"
  )

  const { makeRequest: initiateEdit } = usePost(
    getUrl("MASTER_DATA_API", "USER_CORP", "INITIAL_GET"),
    "get"
  )

  const onEdit = async () => {
    const { deltaId } = await initiateEdit({
      params: {
        companyId: activeCompany?.companyId,
        userId: userEmail
      }
    })
    setFilter({ deltaId })
    setEditMode(true)
  }
  const onCancel = (close = false) => {
    resetFilter()
    setEditMode(false)
    if (close) setActiveCompany(null)
  }
  const onOk = async () => {
    const data = {
      companyId: activeCompany?.companyId,
      roleId,
      deltaId: filter.deltaId,
      userId: userEmail
    }
    console.log(data)
    await makeRequest({ data })
    onCancel(true)
  }
  return (
    <Modal
      title={`${editMode ? "Edit" : "View"} Company Information`}
      centered
      open={!!activeCompany}
      onCancel={() => onCancel(true)}
      // onOk={onOk}
      // onCancel={onCancel}
      // closeIcon={false}
      width={1000}
      footer={
        editMode ? (
          <>
            <Button onClick={() => onCancel()}>Cancel</Button>
            <Button type="primary" onClick={onOk}>
              Save
            </Button>
          </>
        ) : (
          <></>
        )
      }
      // {...(editMode ? {} : { footer: "" })}
      //   footer={<Select />}
    >
      {activeCompany && (
        <UserCorpTree
          companyId={activeCompany.companyId}
          viewMode={!editMode}
          key={editMode.toString()}
        >
          <Form
            layout="inline"
            className="my-1 w-100 d-flex align-item-center justify-content-between"
          >
            <div className="d-flex align-item-center justify-content-between">
              <Form.Item name="company" label="Company" rules={[{ required: true }]}>
                <Select
                  disabled
                  style={{ width: "200px" }}
                  defaultValue={activeCompany.companyName}
                />{" "}
              </Form.Item>
              <Form.Item
                name="roleId"
                label="Role"
                rules={[{ required: true }]}
                // style={{ fontWeight: "bold", width: "100%" }}
              >
                <Select
                  options={roleList}
                  disabled={!editMode}
                  loading={loading}
                  style={{ width: "200px" }}
                  onChange={(s) => setRoleId(s)}
                  defaultValue={activeCompany.roleId}
                />{" "}
              </Form.Item>
            </div>
            {isfromUserProfileSignal.value || (
              <Button
                type="primary"
                htmlType="button"
                style={{ float: "right" }}
                hidden={editMode}
                onClick={onEdit}
                icon={<EditOutlined />}
              >
                Edit
              </Button>
            )}
          </Form>{" "}
        </UserCorpTree>
      )}
    </Modal>
  )
}

export default CorpModal

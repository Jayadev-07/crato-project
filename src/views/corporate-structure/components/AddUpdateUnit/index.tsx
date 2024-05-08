import { ModalHeader, Modal } from "reactstrap"
import AddUpdateOtherUnit from "./AddUpdateOtherUnit"
import { useState } from "react"

import { CorpSegment, CorpUnitItemType } from "@views/corporate-structure/CorpTable"
import AddUpdateBU from "./AddUpdateBU"
import getUrl from "@api/url"
import { Button, Dropdown, MenuProps, Space, Spin, notification } from "antd"
import { EllipsisOutlined, LoadingOutlined } from "@ant-design/icons"
import usePost from "@hooks/usePost"

type Props = { activeUnit?: CorpUnitItemType; segment: CorpSegment; refetch: () => void }

const AddUpdateUnit = ({ activeUnit, segment, refetch }: Props) => {
  const edit = !!activeUnit
  const [show, setShow] = useState(false)
  const toggle = () => setShow((s) => !s)

  const onSuccess = (fetch = true) => {
    if (fetch) refetch()
    toggle()
  }
  const { makeRequest: inActiveBU, isLoading: activating } = usePost(
    getUrl("MASTER_DATA_API", "CORP", "BUSINESS_UNIT_UPDATE_STATUS"),
    "put"
  )
  const { makeRequest: inActiveSU, isLoading: inActivating } = usePost(
    getUrl("MASTER_DATA_API", "CORP", "SEGMENT_UNIT_UPDATE_STATUS"),
    "put"
  )
  console.log(edit && show)
  const onClick: MenuProps["onClick"] = async ({ key }) => {
    switch (key) {
      case "2":
        const { message } = await (segment.segmentId == "businessunit"
          ? inActiveBU
          : inActiveSU)({
          params: { unitId: activeUnit?.unitId, isActive: !activeUnit?.isActive },
          data: {}
        })
        notification.success({ message })
        refetch()

        break

      default:
        toggle()
        break
    }
  }

  const items: MenuProps["items"] = [
    {
      label: <span id="Edit">Edit</span>,
      key: "1"
    },
    {
      label: (
        <span id={activeUnit?.isActive ? "Inactivate" : "Activate"}>
          {activeUnit?.isActive ? "Inactivate" : "Activate"}
        </span>
      ),
      key: "2"
    }
    // {
    //   label: "3rd menu item",
    //   key: "3"
    // }
  ]
  return (
    <>
      {edit ? (
        inActivating || activating ? (
          <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        ) : (
          <Dropdown menu={{ items, onClick }} trigger={["click"]}>
            <a onClick={(e) => e.preventDefault()} id="action">
              <Space>
                <EllipsisOutlined />
              </Space>
            </a>
          </Dropdown>
        )
      ) : (
        <Button type="primary" onClick={toggle} id="add-units">
          Add Unit
        </Button>
      )}
      {show && (
        <Modal
          isOpen={show}
          toggle={toggle}
          className="modal-dialog-centered modal-lg"
          id="add-project-modal"
          backdrop="static"
        >
          <ModalHeader className="bg-transparent" toggle={toggle}></ModalHeader>
          <h3 className="fw-bolder text-center">
            {activeUnit ? "Edit " : "Add "} {segment.segmentName}
          </h3>
          {segment.segmentId.includes("businessunit") ? (
            <AddUpdateBU
              segment={segment}
              activeUnit={activeUnit}
              onSuccess={onSuccess}
            />
          ) : (
            <AddUpdateOtherUnit
              segment={segment}
              activeUnit={activeUnit}
              onSuccess={onSuccess}
            />
          )}
          {/*  */}
        </Modal>
      )}
    </>
  )
}

export default AddUpdateUnit
export type TCorpUnit = {
  segment: CorpSegment
  onSuccess: (refetch?: boolean) => void
  activeUnit?: CorpUnitItemType
}

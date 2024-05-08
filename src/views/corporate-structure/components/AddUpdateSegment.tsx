import { Col, Input, Modal, ModalBody, ModalHeader, Row } from "reactstrap"
// import {Select} from "react-select"
// import Select from "react-select"
import Mandatory from "@custom-components/Mandatory"
import { useState } from "react"
import { Edit } from "react-feather"
import { Button, Checkbox, Form, Radio, Select, Tooltip, notification } from "antd"
import { InfoCircleOutlined } from "@ant-design/icons"
import getUrl from "@api/url"
import { CorpSegment } from "../CorpTable"
import useFetch from "@hooks/useFetch"
import { getCompanyId } from "@utils/index"
import usePost from "@hooks/usePost"
type PropType = { activeSegment?: CorpSegment; refetch?: () => void }
// type TSegment = {
//   segmentName: string
//   segmentId: string
//   segmentCode: string
//   companyId: string
//   erpId: string
//   unitFields: string[]
//   hasParent: boolean
//   parentId: string
//   displaysIn: string[]
//   isMandatory: boolean
//   isRestricted: boolean
// }
const INITIAL_VALUES = {
  segmentCode: "",
  segmentName: "",
  unitFields: ["ADDRESS"],
  hasParent: false,
  parentId: "COMPANY",
  displaysIn: "HEADER",
  isMandatory: true,
  isRestricted: true
}
const AddUpdateSegment = ({ activeSegment, refetch }: PropType) => {
  const edit = !!activeSegment
  const [show, setShow] = useState(false)
  const toggle = () => setShow((s) => !s)
  const [segmentList] = useFetch(
    getUrl("MASTER_DATA_API", "CORP", "SEGMENT_LABEL_VALUE"),
    {
      apiParams: {
        method: "POST",
        data: {
          segmentId: activeSegment?.segmentId,
          companyIds: [getCompanyId()]
        }
      },
      callback: (s) => [{ label: "Company", value: "COMPANY" }, ...s.list]
    }
  )
  const { makeRequest: createSegment, isLoading } = usePost(
    getUrl("MASTER_DATA_API", "CORP", "SEGMENT_CREATE")
  )
  const { makeRequest: updateSegment } = usePost(
    `${getUrl("MASTER_DATA_API", "CORP", "SEGMENT_UPDATE")}/${activeSegment?.segmentId}`,
    "put"
  )
  const onSubmit = async (formData: any) => {
    let data = {
      ...formData,
      companyId: getCompanyId(),
      displaysIn: [formData.displaysIn]
    }
    await (activeSegment ? updateSegment : createSegment)({
      data
    })
    notification.success({
      message: `Segment ${activeSegment ? "updated" : "created"} successfully`
    })
    setShow(false)
    refetch?.()
  }

  return (
    <>
      {edit ? (
        <Edit
          size={20}
          className="ms-1 cursor-pointer"
          style={{ color: "#34A353", marginBottom: ".4rem" }}
          onClick={toggle}
          id="edit-segment"
        />
      ) : (
        <Button color="primary" type="primary" onClick={toggle} block id="add-segment">
          Add Segment
        </Button>
      )}
      {show && (
        <Modal
          isOpen={show}
          toggle={toggle}
          className="modal-dialog-centered modal-lg"
          backdrop="static"
        >
          <ModalHeader toggle={toggle} className="bg-transparent" />
          <ModalBody>
            <h3 className="fw-bolder text-center">
              {edit ? "Edit " : "Add New "}Business Level
            </h3>
            <Form
              layout="vertical"
              name="segment"
              size="large"
              onFinish={onSubmit}
              initialValues={
                edit
                  ? {
                      ...activeSegment,
                      displaysIn: activeSegment?.displaysIn?.length
                        ? activeSegment.displaysIn[0]
                        : ""
                    }
                  : INITIAL_VALUES
              }
            >
              <Row className="my-2">
                <Col>
                  <h5 className="fw-bold">
                    Segment Name <Mandatory />
                  </h5>
                  <small>Enter the Segment name</small>
                </Col>
                <Col>
                  <Form.Item
                    rules={[
                      {
                        required: true,
                        type: "string",
                        message: "Segment name is mandatory"
                      },
                      {
                        message: "Segment name is too long",
                        max: 15
                      }
                    ]}
                    name="segmentName"
                  >
                    <Input disabled={!!activeSegment} />
                  </Form.Item>
                </Col>
              </Row>
              <Row className="my-2">
                <Col>
                  <h5 className="fw-bold">
                    Segment Code <Mandatory />
                  </h5>
                  <small>Enter the Segment Code</small>
                </Col>
                <Col>
                  <Form.Item
                    rules={[
                      {
                        required: true,
                        type: "string",
                        message: "Segment code is mandatory"
                      },
                      {
                        message: "Segment code is too long",
                        max: 10
                      }
                    ]}
                    // label="Email"
                    name="segmentCode"
                  >
                    <Input disabled={!!activeSegment} />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col>
                  <h5 className="fw-bold">
                    Parent Unit{" "}
                    {/* {tableFieldData.hasParent && <span className="text-danger">*</span>} */}
                  </h5>
                  <small>Select if this business Level has a Parent Unit</small>
                </Col>
                <Col className="d-flex align-items-center justify-content-start gap-1">
                  <Form.Item
                    valuePropName="checked"
                    name="hasParent"
                    // shouldUpdate={(prevValues, currentValues) => prevValues.gender !== currentValues.gender}
                  >
                    <Checkbox disabled={!!activeSegment} />
                  </Form.Item>
                  <Form.Item
                    // noStyle
                    style={{ width: "100%" }}
                    shouldUpdate={(prevValues, currentValues) =>
                      prevValues.hasParent !== currentValues.hasParent
                    }
                  >
                    {({ getFieldValue }) =>
                      getFieldValue("hasParent") ? (
                        <Form.Item
                          noStyle
                          name="parentId"
                          rules={[{ required: true, message: "Please choose a parent." }]}
                        >
                          <Select
                            showSearch
                            options={segmentList}
                            placeholder="Company"
                            disabled={!!activeSegment}
                          />
                        </Form.Item>
                      ) : (
                        // <Form.Item>
                        <Select
                          disabled
                          style={{ width: "100%" }}
                          placeholder="Company"
                        />
                        // </Form.Item>
                      )
                    }
                  </Form.Item>
                </Col>
              </Row>
              <Row className="mt-2">
                <Col md={6} className="text-wrap">
                  <h5 className="fw-bold">
                    Display as <Mandatory />
                  </h5>
                  <small>Select your preferences to capture this in a transaction</small>
                </Col>
                <Col md={6}>
                  <Form.Item
                    valuePropName="value"
                    name="displaysIn"
                    rules={[{ required: true, message: "Please choose an option" }]}
                  >
                    <Radio.Group disabled={!!activeSegment}>
                      <Radio value={"HEADER"} id="HEADER">
                        Header
                      </Radio>
                      <Radio value={"LINE_ITEM"} id="LINE_ITEM">
                        Line Item
                      </Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
              </Row>
              <Row className="mt-2">
                <Col md="6">
                  <h5 className="fw-bold">Details to be captured</h5>
                  <small>Select the appropriate fields to be captured in the table</small>
                </Col>
                <Col>
                  <Form.Item name="unitFields">
                    <Checkbox.Group
                      options={[
                        { label: "Address", value: "ADDRESS", id: "ADDRESS" },
                        { label: "Tax ID", value: "TAX_ID", id: "TAX_ID" }
                      ]}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row className="mt-2">
                <Col>
                  <Form.Item valuePropName="checked" name="isMandatory">
                    <Checkbox>
                      Field Mandate Check{" "}
                      <Tooltip
                        title={
                          "Select if this field should be a mandatory field while booking a transaction"
                        }
                        arrow={{ pointAtCenter: true }}
                      >
                        <InfoCircleOutlined />
                      </Tooltip>
                    </Checkbox>
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item valuePropName="checked" name="isRestricted">
                    <Checkbox>
                      User Restriction{" "}
                      <Tooltip
                        title={
                          "Select if this segment should be a restricted in user management"
                        }
                        arrow={{ pointAtCenter: true }}
                      >
                        <InfoCircleOutlined />
                      </Tooltip>
                    </Checkbox>
                  </Form.Item>
                </Col>
              </Row>

              <div className="d-flex w-100 justify-content-end">
                <Button
                  className="mx-1"
                  id="new-business-level-discard "
                  htmlType="button"
                  onClick={toggle}
                >
                  Discard
                </Button>
                <Button type="primary" htmlType="submit" loading={isLoading}>
                  Submit
                </Button>
              </div>
            </Form>
          </ModalBody>
        </Modal>
      )}
    </>
  )
}

export default AddUpdateSegment

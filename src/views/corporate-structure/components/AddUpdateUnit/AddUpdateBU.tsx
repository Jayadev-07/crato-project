import getUrl from "@api/url"
import useFetch from "@hooks/useFetch"
import usePost from "@hooks/usePost"
import { getCompanyId } from "@utils/index"
import { Button, Checkbox, Form, Input, Radio, Skeleton, notification } from "antd"
import { Col, ModalBody, Row } from "reactstrap"
import { TCorpUnit } from "."
import SkeletonWrapper from "@custom-components/skeleton/SkeletonWrapper"
import Mandatory from "@custom-components/Mandatory"

const INITIAL_VALUE = {
  useBillAs: "LEGAL_ADDRESS",
  useShipAs: "LEGAL_ADDRESS",
  useRemitAs: "LEGAL_ADDRESS",
  isSameLegalAddress: false,
  isActive: true
}
const AddUpdateBU = ({ segment, activeUnit, onSuccess }: TCorpUnit) => {
  const [res, { loading }] = useFetch<any>(
    `${getUrl("MASTER_DATA_API", "CORP", "BUSINESS_UNIT")}/${activeUnit?.unitId}`,
    {
      noFetch: !activeUnit
    }
  )

  const { makeRequest: createBU, isLoading } = usePost(
    getUrl("MASTER_DATA_API", "CORP", "BUSINESS_UNIT_CREATE")
  )

  const { makeRequest: updateBU, isLoading: isUpdating } = usePost(
    getUrl("MASTER_DATA_API", "CORP", "BUSINESS_UNIT_UPDATE"),
    "put"
  )
  console.log(segment)

  const onSubmit = async (formData: FormResponse) => {
    const data = {
      ...formData,
      companyId: getCompanyId(),
      physicalAddress: formData.isSameLegalAddress
        ? formData.legalAddress
        : formData.physicalAddress,
      segmentId: segment.segmentId,
      parentId: segment.parentId
    }
    await (activeUnit
      ? updateBU({ data: { ...data, unitId: res?.unitId } })
      : createBU({ data }))
    notification.success({
      message: `Corp unit ${activeUnit ? "updated" : "created"} successfully`
    })
    onSuccess?.()
  }

  return (
    <ModalBody>
      <SkeletonWrapper loading={!!activeUnit && !res} skeleton={skeleton}>
        <Form
          size="large"
          onFinish={onSubmit}
          initialValues={activeUnit ? res : INITIAL_VALUE}
          key={loading.toString()}
        >
          <Row>
            <Col>
              <h5 className="fw-bold">
                Code <Mandatory />
              </h5>
              <Form.Item
                rules={[{ required: true, type: "string", message: "Code is required" }]}
                name="unitCode"
              >
                <Input disabled={!!activeUnit} />
              </Form.Item>
            </Col>
            <Col>
              <h5 className="fw-bold">
                Name <Mandatory />
              </h5>
              <Form.Item
                rules={[{ required: true, type: "string", message: "Name is required" }]}
                name="unitName"
              >
                <Input disabled={!!activeUnit} />
              </Form.Item>
            </Col>
          </Row>
          {segment.unitFields.includes("TAX_ID") && (
            <Row>
              <Col>
                <h5 className="fw-bold">
                  Tax ID <Mandatory />
                </h5>
                <Form.Item
                  rules={[
                    { required: true, type: "string", message: "Name is required" }
                  ]}
                  name="taxId"
                >
                  <Input disabled={!!activeUnit} />
                </Form.Item>
              </Col>
            </Row>
          )}
          {segment.unitFields.includes("ADDRESS") && (
            <>
              <div id="legal-address ">
                <h5 className="fw-bold">
                  Legal Address <Mandatory />
                </h5>

                <Row>
                  <Col>
                    {/* <h5 className="fw-bold">Address</h5> */}
                    <Form.Item
                      rules={[
                        { required: true, type: "string", message: "Address is required" }
                      ]}
                      name={["legalAddress", "addressLine1"]}
                    >
                      <Input placeholder="Address" />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    {/* <h5 className="fw-bold">City</h5> */}
                    <Form.Item
                      rules={[
                        { required: true, type: "string", message: "City is required" }
                      ]}
                      name={["legalAddress", "city"]}
                    >
                      <Input placeholder="City" />
                    </Form.Item>
                  </Col>
                  <Col>
                    {/* <h5 className="fw-bold">State</h5> */}
                    <Form.Item
                      rules={[
                        { required: true, type: "string", message: "State is required" }
                      ]}
                      name={["legalAddress", "state"]}
                    >
                      <Input placeholder="State" />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    {/* <h5 className="fw-bold">Country</h5> */}
                    <Form.Item
                      rules={[
                        { required: true, type: "string", message: "Country is required" }
                      ]}
                      name={["legalAddress", "country"]}
                    >
                      <Input placeholder="Country" />
                    </Form.Item>
                  </Col>
                  <Col>
                    {/* <h5 className="fw-bold">Zip code</h5> */}
                    <Form.Item
                      rules={[
                        { required: true, type: "string", message: "Zipcode is required" }
                      ]}
                      name={["legalAddress", "zipCode"]}
                    >
                      <Input placeholder="Zip Code" />
                    </Form.Item>
                  </Col>
                </Row>
              </div>
              <div id="physical-address">
                <Row>
                  <Col xs="3">
                    <h5 className="fw-bold ">
                      Physical Address <Mandatory />
                    </h5>
                  </Col>
                  <Col>
                    <Form.Item valuePropName="checked" name="isSameLegalAddress">
                      <Checkbox> Same as Legal Address</Checkbox>
                    </Form.Item>
                  </Col>{" "}
                </Row>
                <Form.Item
                  noStyle
                  shouldUpdate={(prevValues, currentValues) =>
                    prevValues.isSameLegalAddress !== currentValues.isSameLegalAddress
                  }
                >
                  {({ getFieldValue }) =>
                    !getFieldValue("isSameLegalAddress") ? (
                      <>
                        {" "}
                        <Row>
                          <Col>
                            <Form.Item
                              rules={[
                                {
                                  required: true,
                                  type: "string",
                                  message: "Address is required"
                                }
                              ]}
                              name={["physicalAddress", "addressLine1"]}
                            >
                              <Input placeholder="Address" />
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            {/* <h5 className="fw-bold">City</h5> */}
                            <Form.Item
                              rules={[
                                {
                                  required: true,
                                  type: "string",
                                  message: "City is required"
                                }
                              ]}
                              name={["physicalAddress", "city"]}
                            >
                              <Input placeholder="City" />
                            </Form.Item>
                          </Col>
                          <Col>
                            {/* <h5 className="fw-bold">State</h5> */}
                            <Form.Item
                              rules={[
                                {
                                  required: true,
                                  type: "string",
                                  message: "State is required"
                                }
                              ]}
                              name={["physicalAddress", "state"]}
                            >
                              <Input placeholder="State" />
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            {/* <h5 className="fw-bold">Country</h5> */}
                            <Form.Item
                              rules={[
                                {
                                  required: true,
                                  type: "string",
                                  message: "Country is required"
                                }
                              ]}
                              name={["physicalAddress", "country"]}
                            >
                              <Input placeholder="Country" />
                            </Form.Item>
                          </Col>
                          <Col>
                            {/* <h5 className="fw-bold">Zip code</h5> */}
                            <Form.Item
                              rules={[
                                {
                                  required: true,
                                  type: "string",
                                  message: "Zipcode is required"
                                }
                              ]}
                              name={["physicalAddress", "zipCode"]}
                            >
                              <Input placeholder="Zip Code" />
                            </Form.Item>
                          </Col>
                        </Row>
                      </>
                    ) : (
                      <></>
                    )
                  }
                </Form.Item>
              </div>
              <Row className="mt-1">
                <Col></Col>
                <Col xs="3" className="text-center">
                  Legal Address
                </Col>
                <Col xs="3" className="text-center">
                  Physical Address
                </Col>
              </Row>{" "}
              {[
                { label: "Use as Bill To Address - Payables", key: "useBillAs" },
                { label: "Use as Ship To Address - Payables", key: "useShipAs" },
                { label: "Use as Remit To Address - Revenue", key: "useRemitAs" }
              ].map((s) => (
                <Row key={s.key}>
                  <Col>
                    <h5 className="fw-bold">{s.label}</h5>
                  </Col>
                  <Col>
                    <Form.Item
                      noStyle
                      shouldUpdate={(prevValues, currentValues) =>
                        prevValues.isSameLegalAddress !== currentValues.isSameLegalAddress
                      }
                    >
                      {({ getFieldValue, setFieldsValue }) => {
                        if (getFieldValue("isSameLegalAddress")) {
                          setFieldsValue({ [s.key]: "LEGAL_ADDRESS" })
                        }
                        return (
                          <Form.Item name={s.key} className="mb-0">
                            <Radio.Group defaultValue={"LEGAL_ADDRESS"} className="w-100">
                              <Row>
                                <Col className="text-center">
                                  <Radio value={"LEGAL_ADDRESS"} defaultChecked />
                                </Col>
                                <Col className="text-center">
                                  <Radio
                                    value={"PHYSICAL_ADDRESS"}
                                    disabled={getFieldValue("isSameLegalAddress")}
                                  />
                                </Col>
                              </Row>
                            </Radio.Group>
                          </Form.Item>
                        )
                      }}
                    </Form.Item>
                  </Col>
                </Row>
              ))}
            </>
          )}
          <div className="d-flex w-100 justify-content-end">
            <Button
              className="mx-1"
              htmlType="button"
              disabled={isLoading || isUpdating}
              onClick={() => onSuccess(false)}
              id="discard"
            >
              Discard
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading || isUpdating}
              id="submit"
            >
              Submit
            </Button>
          </div>
        </Form>
      </SkeletonWrapper>
    </ModalBody>
  )
}

export default AddUpdateBU

export type FormResponse = {
  unitId: string
  taxId: string
  legalAddress: Address
  isSameLegalAddress: boolean
  physicalAddress?: Address
  useBillAs: string
  useShipAs: string
  useRemitAs: string
  unitName: string
  unitCode: string
  segmentId: string
  parentId: string
  isActive: boolean
}

export type Address = {
  addressLine1: string
  city: string
  state: string
  country: string
  zipCode: string
}

const skeleton = [2, 1, 2, 2, 2].map((n) => (
  <Row className="mt-2">
    {Array(n).fill(
      <Col>
        <Skeleton.Input block />
      </Col>
    )}
  </Row>
))

import { Col, ModalBody, Row } from "reactstrap"
import { Button, Form, Input, Select, Skeleton, notification } from "antd"
import useFetch from "@hooks/useFetch"
import getUrl from "@api/url"
import { getCompanyId } from "@utils/index"
import { TPaginationType, TOptions } from "@src/types/common.type"
import usePost from "@hooks/usePost"
import { TCorpUnit } from "."
import SkeletonWrapper from "@custom-components/skeleton/SkeletonWrapper"
import Mandatory from "@custom-components/Mandatory"

const AddUpdateOtherUnit = ({ segment, onSuccess, activeUnit }: TCorpUnit) => {
  console.log(segment)

  const [res, { loading }] = useFetch<TUnitResponse>(
    `${getUrl("MASTER_DATA_API", "CORP", "SEGMENT_UNIT")}/${activeUnit?.unitId}`,
    { noFetch: !activeUnit }
  )
  const [parentList] = useFetch<TPaginationType<TOptions>>(
    getUrl("MASTER_DATA_API", "CORP", "UNIT_LABEL_VALUE"),
    {
      apiParams: {
        data: {
          segmentId: segment.parentId,
          companyIds: [getCompanyId()]
        },
        method: "POST"
      }
    }
  )
  const { makeRequest: updateUnit, isLoading: isUpdating } = usePost(
    getUrl("MASTER_DATA_API", "CORP", "SEGMENT_UNIT_UPDATE"),
    "put"
  )

  const { makeRequest: createUnit, isLoading } = usePost(
    getUrl("MASTER_DATA_API", "CORP", "SEGMENT_UNIT_CREATE")
  )
  const onSubmit = async (formData: TUnit) => {
    const data = {
      ...formData,
      parentId: formData.parentId ?? "COMPANY",
      companyId: getCompanyId(),
      segmentId: segment.segmentId
    }
    await (activeUnit
      ? updateUnit({ data: { ...data, unitId: res?.unitId } })
      : createUnit({ data }))
    notification.success({
      message: `Corp unit ${activeUnit ? "updated" : "created"} successfully`
    })
    onSuccess()
  }
  console.log(loading)

  return (
    <ModalBody>
      <SkeletonWrapper loading={!!activeUnit && !res} skeleton={skeleton}>
        <Form onFinish={onSubmit} size="large" initialValues={activeUnit ? res : {}}>
          <Row className="my-2">
            <Col>
              <h5 className="fw-bold">
                Code
                <Mandatory />
              </h5>

              <Form.Item
                rules={[
                  { required: true, type: "string", message: "Code is required" },
                  {
                    message: "Code is too long",
                    max: 10
                  }
                ]}
                name="unitCode"
              >
                <Input disabled={!!activeUnit} />
              </Form.Item>
            </Col>
            <Col>
              <h5 className="fw-bold">
                Name
                <Mandatory />
              </h5>
              <Form.Item
                rules={[
                  { required: true, type: "string", message: "Name is required" },
                  {
                    message: "Unit name is too long",
                    max: 15
                  }
                ]}
                name="unitName"
              >
                <Input disabled={!!activeUnit} />
              </Form.Item>
            </Col>
          </Row>
          {segment.unitFields.includes("ADDRESS") && (
            <div id="legal-address ">
              <h5 className="fw-bold">
                Address
                <Mandatory />
              </h5>

              <Row>
                <Col>
                  {/* <h5 className="fw-bold">Address</h5> */}
                  <Form.Item
                    rules={[
                      { required: true, type: "string", message: "Address is required" }
                    ]}
                    name={["address", "addressLine1"]}
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
                    name={["address", "city"]}
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
                    name={["address", "state"]}
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
                    name={["address", "country"]}
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
                    name={["address", "zipCode"]}
                  >
                    <Input placeholder="Zip Code" />
                  </Form.Item>
                </Col>
              </Row>
            </div>
          )}

          <Row className="my-2">
            {segment.unitFields.includes("TAX_ID") && (
              <Col>
                <h5 className="fw-bold">
                  Tax ID
                  <Mandatory />
                </h5>
                <Form.Item
                  rules={[
                    { required: true, type: "string", message: "Tax ID is required" }
                  ]}
                  name="taxId"
                >
                  <Input disabled={!segment?.unitFields.includes("TAX_ID")} />
                </Form.Item>
              </Col>
            )}
            {segment.parentId == "COMPANY" || (
              <Col>
                <h5 className="fw-bold">{segment.parentName}</h5>
                <Form.Item name="parentId" style={{ width: "100%" }}>
                  <Select showSearch options={parentList?.list ?? []} />
                </Form.Item>
              </Col>
            )}
          </Row>
          <div className="d-flex w-100 justify-content-end">
            <Button
              className="mx-1"
              htmlType="button"
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

export default AddUpdateOtherUnit

type TUnit = {
  unitCode: string
  unitName: string
  address: string
  taxId: string
  parentId: string
}

type TUnitResponse = {
  companyId: string
  unitName: string
  unitCode: string
  taxId: string
  segmentId: string
  parentId: string
  isActive: boolean
  unitId: string
  address: Address
}

type Address = {
  addressLine1: string
  addressLine2: null
  city: string
  state: string
  zipCode: string
  country: string
  phoneNumber: null
  fax: null
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

import {
  Button,
  Checkbox,
  Form,
  Input,
  InputNumber,
  Modal,
  Spin,
  notification
} from "antd"
import { useEffect } from "react"
import { Card, CardBody, CardHeader, CardTitle, Col, Row } from "reactstrap"
import useFetch from "@hooks/useFetch"
import getUrl from "@api/url"
import { TOptions } from "@src/types/common.type"
import usePost from "@hooks/usePost"
import { TCompanyProfile } from "./companyProfile.type"
import Breadcrumbs from "@custom-components/Breadcrumbs"
import UploadLogo from "./UploadLogo"
import { getCompanyId } from "@utils/index"
import SearchableSelect from "@custom-components/SearchableSelect"

const CompanyProfile = () => {
  const companyId = getCompanyId()

  const [form] = Form.useForm()
  const isMulticurrency = Form.useWatch("isMultiCurrency", form)
  const defaultCurrency = Form.useWatch("defaultCurrency", form)

  const [companyType = [] as unknown as TOptions] = useFetch<TOptions>(
    getUrl("AUTHAPI", "COMPANY_TYPE")
  )
  const [indutryType = [] as unknown as TOptions] = useFetch<TOptions>(
    getUrl("AUTHAPI", "INDUSTRY_TYPE")
  )
  const [currencyOption = [] as unknown as TOptions] = useFetch<TOptions>(
    getUrl("AUTHAPI", "CURRENCY")
  )
  const [timeZoneOption = [] as unknown as TOptions] = useFetch<TOptions>(
    getUrl("AUTHAPI", "TIME_ZONE")
  )

  const [data = {}, { refetch, loading }] = useFetch<TCompanyProfile>(
    getUrl("MASTER_DATA_API", "COMPANY_PROFILE"),
    { apiParams: { params: { companyId } } }
  )

  const { makeRequest: saveCompanyProfile } = usePost(
    getUrl("MASTER_DATA_API", "COMPANY_PROFILE"),
    data.companyId ? "put" : "post"
  )

  const onSubmit = async (fileName?: string) => {
    const payload = await form.getFieldsValue()
    await saveCompanyProfile({
      data: data.companyId
        ? {
            ...payload,
            companyId: data.companyId,
            ...(fileName ? { imgUrl: fileName } : {})
          }
        : payload
    })
    await refetch()
    notification.success({ message: "Company profile updated successfully" })
    handleCancel()
  }

  const onSaveChanges = async () => {
    try {
      await form.validateFields()
      Modal.warning({
        title: "Warning",
        centered: true,
        content: (
          <>
            You are changing the business profile, and it will have its effect in multiple
            functional areas. Please confirm to proceed.
          </>
        ),
        okCancel: true,
        okText: "Proceed",
        cancelButtonProps: { id: "cancel" },
        okButtonProps: { id: "proceed", className: "bg-primary" },
        onOk: () => onSubmit(),
        onCancel: handleCancel
      })
    } finally {
    }
  }
  const handleCancel = () => {
    form.resetFields()
  }
  useEffect(() => {
    form.setFieldsValue(setInitialValue())
  }, [JSON.stringify(data)])

  const setInitialValue = () => {
    if (!data.companyId)
      return { isMultiCurrency: false, defaultCurrency: "USD", dateFormat: "MM/DD/YYYY" }
    const { imgUrl, ...rest } = data
    return rest
  }

  return (
    <Spin spinning={loading} size="large">
      <Breadcrumbs withGoBack title="Company Profile" data={breadCrumb} />
      <Form
        form={form}
        layout="vertical"
        colon={false}
        size="large"
        initialValues={setInitialValue()}
      >
        <Card id="company-profile">
          <CardHeader className="border-bottom">
            <CardTitle tag="h4">Company Profile</CardTitle>
            <Button htmlType="button" type="primary" onClick={onSaveChanges}>
              Save Changes
            </Button>
          </CardHeader>

          <CardBody className="py-2 my-25">
            <UploadLogo imgUrl={data.imgUrl} onSubmit={onSubmit} />

            <h2 className="mb-1">Company Information</h2>
            <Row>
              <Col sm="6" className="mb-1">
                <Form.Item
                  label="Legal Name"
                  name="legalName"
                  rules={[{ required: true, message: errorMessage }]}
                >
                  <Input disabled={!!data.legalName} />
                </Form.Item>
              </Col>
              <Col sm="3">
                <Form.Item
                  label="Display Name"
                  name="displayName"
                  rules={[{ required: true, message: errorMessage }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col sm="3">
                <Form.Item label="Tax ID" name="taxId">
                  <Input />
                </Form.Item>
              </Col>

              <Col sm="6" className="mb-1">
                <Form.Item
                  label="Company Type"
                  name="companyType"
                  rules={[{ required: true, message: errorMessage }]}
                >
                  <SearchableSelect id="companyType-list" options={companyType} />
                </Form.Item>
              </Col>
              <Col sm="6" className="mb-1">
                <Form.Item
                  label="Industry Type"
                  name="industryType"
                  rules={[{ required: true, message: errorMessage }]}
                >
                  <SearchableSelect id="industryType-list" options={indutryType} />
                </Form.Item>
              </Col>

              <Col sm="6">
                <Form.Item
                  label="Registered Business Address"
                  name={["businessAddress", "addressLine1"]}
                  rules={[{ required: true, message: errorMessage }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col sm="6">
                <Form.Item
                  label="City"
                  name={["businessAddress", "city"]}
                  rules={[{ required: true, message: errorMessage }]}
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col sm="6">
                <Form.Item
                  label="State"
                  name={["businessAddress", "state"]}
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col sm="6">
                <Form.Item
                  label="Country"
                  name={["businessAddress", "country"]}
                  rules={[{ required: true, message: errorMessage }]}
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col sm="6">
                <Form.Item
                  label="Zip Code"
                  name={["businessAddress", "zipCode"]}
                  rules={[{ required: true, message: errorMessage }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col sm="6">
                <Form.Item
                  label="Business Phone Number"
                  name={["businessAddress", "phoneNumber"]}
                >
                  <InputNumber type="number" style={{ width: "100%" }} controls={false} />
                </Form.Item>
              </Col>
            </Row>
          </CardBody>

          <CardHeader className="border-top">
            <CardTitle tag="h4">Preferences</CardTitle>
          </CardHeader>

          <CardBody>
            <Row>
              <Col md="4" lg="5" className="mb-1">
                <Form.Item
                  label="Base Currency"
                  name="defaultCurrency"
                  rules={[{ required: true, message: errorMessage }]}
                >
                  <SearchableSelect
                    id="base-currency-list"
                    options={currencyOption}
                    onSelect={(e) => form.setFieldValue("transactionalCurrencies", [e])}
                  />
                </Form.Item>
              </Col>
              <Col md="3" lg="2" style={{ marginTop: "2.5rem" }}>
                <Form.Item
                  name="isMultiCurrency"
                  valuePropName="checked"
                  style={{ marginLeft: "1.5rem" }}
                >
                  <Checkbox>Enable Multiple Currency</Checkbox>
                </Form.Item>
              </Col>
              <Col md="5" className="mb-1">
                <Form.Item
                  name="transactionalCurrencies"
                  label="Transactional Currency"
                  rules={[{ required: !!isMulticurrency, message: errorMessage }]}
                >
                  <SearchableSelect
                    id="multi-currency-list"
                    mode="multiple"
                    disabled={!isMulticurrency}
                    options={currencyOption?.map((v) => {
                      if (v.value !== defaultCurrency) return v
                      return { ...v, disabled: true }
                    })}
                  />
                </Form.Item>
              </Col>

              <Col md="6" className="mb-1">
                <Form.Item
                  label="Time Zone"
                  name="timeZoneId"
                  rules={[{ required: true, message: errorMessage }]}
                >
                  <SearchableSelect id="timeZone-list" options={timeZoneOption} />
                </Form.Item>
              </Col>
              <Col md="6" className="mb-1">
                <Form.Item
                  label="Date Format"
                  name="dateFormat"
                  rules={[{ required: true, message: errorMessage }]}
                >
                  <SearchableSelect id="dateFormat-list" options={dateformatOptions} />
                </Form.Item>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Form>
    </Spin>
  )
}

export default CompanyProfile

const dateformatOptions = [
  { label: "DD/MM/YYYY", value: "DD/MM/YYYY" },
  { label: "MM/DD/YYYY", value: "MM/DD/YYYY" }
]

const breadCrumb = [
  { title: "Settings", link: "/settings" },
  { title: "Master Data", link: "" },
  { title: "Company Profile", link: "" }
]

const errorMessage = "This field is mandatory"

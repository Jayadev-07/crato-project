import getUrl from "@api/url"
import useFetch from "@hooks/useFetch"
import usePost from "@hooks/usePost"
import { TPaginationType, TOptions } from "@src/types/common.type"
import { getCompanyId } from "@utils/index"
import { Button, Drawer, Form, Input, Select, Space, Spin, notification } from "antd"
import { TGlAccountLite } from "."
import { useEffect } from "react"

interface CreateEditCoaProps {
  onClose: () => void
  open: boolean
  glDetails: TGlAccountLite | null
  refetch: () => void
}

const AddUpdateGl: React.FC<CreateEditCoaProps> = ({
  onClose,
  open,
  glDetails,
  refetch
}) => {
  const [form] = Form.useForm()
  const [businessUnits = [] as unknown as TPaginationType<TOptions>] = useFetch<
    TPaginationType<TOptions>
  >(getUrl("MASTER_DATA_API", "CORP", "UNIT_LABEL_VALUE"), {
    apiParams: {
      data: {
        companyIds: [getCompanyId()],
        segmentId: "businessunit" + getCompanyId()
      },
      method: "POST"
    }
  })

  const [updatedGlDetails, { loading }] = useFetch<any>(
    `${getUrl("MASTER_DATA_API", "COA")}/${glDetails?.glId}`,
    {
      noFetch: !glDetails
    }
  )

  const [glTypes = [] as unknown as TOptions] = useFetch<TOptions>(
    getUrl("MASTER_DATA_API", "COA", "GL_TYPE")
  )

  const { makeRequest: saveGl, isLoading: isGlSaving } = usePost(
    getUrl("MASTER_DATA_API", "COA")
  )

  const { makeRequest: updateGl, isLoading: isGlUpdating } = usePost(
    getUrl("MASTER_DATA_API", "COA"),
    "put"
  )

  const onSubmit = async () => {
    await form.validateFields()
    await (glDetails
      ? updateGl({ data: { ...form.getFieldsValue(), glId: glDetails?.glId } })
      : saveGl({ data: { ...form.getFieldsValue(), companyId: getCompanyId() } }))
    notification.success({
      message: glDetails
        ? "GL account updated successfully"
        : "GL account created successfully"
    })
    onClose()
    form.resetFields()
    refetch()
  }

  useEffect(() => {
    if (!updatedGlDetails) return
    form.setFieldsValue(updatedGlDetails)
  }, [updatedGlDetails])

  return (
    <>
      <Drawer
        maskClosable={false}
        title={!glDetails ? "Create a GL account" : "Update a GL account"}
        onClose={() => {
          onClose()
          form.resetFields()
        }}
        open={open}
        extra={
          <Space>
            <Button
              id="add-update-gl"
              loading={isGlSaving || isGlUpdating}
              onClick={onSubmit}
              type="primary"
            >
              {glDetails ? "Save" : "Create"}
            </Button>
          </Space>
        }
      >
        <Spin spinning={loading}>
          <Form
            name="gl-add-update"
            form={form}
            layout="vertical"
            colon={false}
            size="large"
          >
            <Form.Item
              label="GL Code"
              name="glCode"
              rules={[
                {
                  required: true,
                  type: "string",
                  message: "Gl code is mandatory"
                },
                {
                  message: "Maximum character for 16 digits reached",
                  max: 16
                }
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="GL Name"
              name="glName"
              rules={[
                {
                  required: true,
                  type: "string",
                  message: "GL name is mandatory"
                },
                {
                  message: "Maximum character for 32 digits reached",
                  max: 32
                }
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="GL Description" name="description">
              <Input />
            </Form.Item>
            <Form.Item
              name="glType"
              label="GL Type"
              rules={[
                { required: true, message: "At least 1 GL type should be selected" }
              ]}
            >
              <Select options={glTypes} />
            </Form.Item>
            <Form.Item
              name="unitIds"
              label="Business Unit"
              rules={[
                { required: true, message: "At least 1 business unit should be selected" }
              ]}
            >
              <Select mode="multiple" options={businessUnits.list} />
            </Form.Item>
          </Form>
        </Spin>
      </Drawer>
    </>
  )
}

export default AddUpdateGl

export type GlAccount = {
  glId: string
  companyId: string
  glCode: string
  glName: string
  description: string | null
  glType: String
  unitIds: string[]
}

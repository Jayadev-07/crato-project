import getUrl from "@api/url"
import SearchableSelect from "@custom-components/SearchableSelect"
import useFetch from "@hooks/useFetch"
import { TOptions } from "@src/types/common.type"
import { getCompanyId } from "@utils/index"
import { Button, Form, Modal } from "antd"

const CopyFromModal = (props: TProps) => {
  const { show, companyList, onSubmit, setShow, loading } = props
  const [form] = Form.useForm()
  const companyId = Form.useWatch("companyId", form)
  const [roleList] = useFetch<TOptions>(
    getUrl("MASTER_DATA_API", "ROLE_API", "LABEL_VALUE"),
    {
      apiParams: { params: { companyId } },
      noFetch: !companyId
    }
  )

  const onFinish = async (data: any) => {
    try {
      await onSubmit(data)
      form.resetFields()
    } catch (error) {
      console.log(error)
    }
  }
  const onCancel = () => {
    form.resetFields()
    setShow(false)
  }

  return (
    <Modal
      open={show}
      centered
      maskClosable={false}
      footer={false}
      destroyOnClose
      onCancel={onCancel}
    >
      <Form
        layout="vertical"
        colon={false}
        form={form}
        onFinish={onFinish}
        initialValues={{ companyId: getCompanyId() }}
      >
        <Form.Item label="Company" name="companyId" rules={[{ required: true }]}>
          <SearchableSelect id="copy-from-company" options={companyList} />
        </Form.Item>
        <Form.Item label="Role Name" name="roleId" rules={[{ required: true }]}>
          <SearchableSelect
            id="copy-from-role"
            options={roleList}
            disabled={!companyId}
          />
        </Form.Item>
        <div className="text-end">
          <Button
            htmlType="submit"
            id="copy-from-proceed"
            loading={loading}
            type="primary"
          >
            Copy
          </Button>
        </div>
      </Form>
    </Modal>
  )
}

export default CopyFromModal

type TProps = {
  show: boolean
  setShow: React.Dispatch<React.SetStateAction<boolean>>
  companyList: TOptions | undefined
  onSubmit: (data: any) => void
  loading: boolean
}

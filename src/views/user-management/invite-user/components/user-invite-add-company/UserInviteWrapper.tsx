import { Button, FormInstance, Modal } from "antd"
import { ReactNode, useState } from "react"
import { Card } from "reactstrap"

const UserInviteWrapper = ({
  modal,
  children,
  form,
  isLoading
}: {
  form: FormInstance<any>
  children: ReactNode
  modal: boolean
  isLoading: boolean
}) => {
  //   const [form] = Form.useForm()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const toggle = () => setIsModalOpen((s) => !s)
  return modal ? (
    <>
      <div className="w-100 d-flex justify-content-end">
        <Button type="primary" onClick={toggle} loading={isLoading} id="add-company">
          Add Company
        </Button>
      </div>
      <Modal
        title="Add Company"
        open={isModalOpen}
        onOk={() => {
          form.submit()
          toggle()
        }}
        onCancel={toggle}
        className="over-drawer"
      >
        {children}
      </Modal>
    </>
  ) : (
    <Card>
      {/* <CardHeader>Add Company</CardHeader> */}

      {children}
      <Button
        type="primary"
        htmlType="button"
        onClick={form.submit}
        loading={isLoading}
        id="add-company"
      >
        Add Company
      </Button>
    </Card>
  )
}

export default UserInviteWrapper

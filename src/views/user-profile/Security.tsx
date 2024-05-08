import getUrl from "@api/url"
import InputPassword from "@custom-components/InputPassword"
import PasswordValidator from "@custom-components/password-validator"
import useCapsLock from "@hooks/useCapsLock"
import usePost from "@hooks/usePost"
import useCompanyData from "@src/store/companyData"
import { passwordValidator } from "@utils/index"
import { Button, Card, Form } from "antd"
import { CardBody, CardHeader, CardTitle, Col, Row } from "reactstrap"

const Security = () => {
  const [form] = Form.useForm()
  const userName = useCompanyData((state) => state.email)
  const password = Form.useWatch("newPassword", form)
  const oldPasswordCaps = useCapsLock()
  const newPasswordCaps = useCapsLock()
  const confirmPasswordCaps = useCapsLock()
  const { makeRequest, isLoading } = usePost(
    getUrl("AUTHENTICATION_API", "AUTHENTICATION_PASSWORD", "CHANGE"),
    "put",
    { successToast: true }
  )

  const handleSubmit = (payload: any) => {
    makeRequest({
      data: {
        userName,
        newPassword: payload?.newPassword,
        oldPassword: payload?.oldPassword
      }
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle tag="h4">Change Password</CardTitle>
      </CardHeader>
      <CardBody>
        <Form
          onFinish={handleSubmit}
          name="change-password"
          form={form}
          layout="vertical"
          colon={false}
          size="large"
        >
          <Row>
            <Col lg={7}>
              <Col md={12}>
                <Form.Item
                  name="oldPassword"
                  label={<>Old Password {oldPasswordCaps.capsLockMsg}</>}
                  rules={[
                    {
                      required: true
                    }
                  ]}
                >
                  <InputPassword {...oldPasswordCaps} />
                </Form.Item>
              </Col>
              <Col md={12}>
                <Form.Item
                  name="newPassword"
                  label={<>New Password {newPasswordCaps.capsLockMsg}</>}
                  rules={[
                    {
                      required: true,
                      min: 8,
                      max: 16,
                      validator: passwordValidator
                    }
                  ]}
                >
                  <InputPassword {...newPasswordCaps} />
                </Form.Item>
              </Col>
              <Col md={12}>
                <Form.Item
                  validateTrigger={["onSubmit"]}
                  name="confirmNewPassword"
                  label={<>Confirm New Password {confirmPasswordCaps.capsLockMsg}</>}
                  rules={[
                    { required: true },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("newPassword") === value)
                          return Promise.resolve()
                        return Promise.reject(new Error("Passwords must match!"))
                      }
                    })
                  ]}
                >
                  <InputPassword {...confirmPasswordCaps} />
                </Form.Item>
              </Col>
            </Col>
            <Col lg={5}>
              <PasswordValidator value={password} />
            </Col>
            <Col lg={12}>
              <div
                style={{
                  display: "grid",
                  placeItems: "center"
                }}
              >
                <Button
                  loading={isLoading}
                  type="primary"
                  className="mt-1"
                  htmlType="submit"
                >
                  Change Password
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </CardBody>
    </Card>
  )
}

export default Security

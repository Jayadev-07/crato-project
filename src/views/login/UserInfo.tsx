import InputPassword from "@custom-components/InputPassword"
import useCapsLock from "@hooks/useCapsLock"
import { Form, Input } from "antd"

import { Button as AntButton } from "antd"
import { Link } from "react-router-dom"

const UserInfo = (props: TProp) => {
  const { isLoading, onSubmit } = props
  const [form] = Form.useForm()

  const capsLock = useCapsLock()

  const emailValidator = (_: unknown, value: string | undefined) => {
    if (!value) return Promise.reject("Please enter email ID")
    if (!isValidEmail(value)) return Promise.reject("Please enter a valid email ID")
    return Promise.resolve()
  }

  return (
    <>
      <Form form={form} layout="vertical" onFinish={onSubmit} name="user" size="large">
        <Form.Item
          validateTrigger={["onSubmit"]}
          rules={[{ required: true, type: "email", validator: emailValidator }]}
          label="Email"
          name="email"
        >
          <Input autoFocus />
        </Form.Item>
        <Form.Item
          rules={[{ required: true, message: "Please enter your password" }]}
          label={<>Password {capsLock.capsLockMsg}</>}
          name="password"
        >
          <InputPassword {...capsLock} />
        </Form.Item>
        <AntButton
          id="login-sign-in"
          loading={isLoading}
          htmlType="submit"
          type="primary"
          block
          className="mt-2"
        >
          {isLoading ? "Signing in" : "Sign in"}
        </AntButton>
      </Form>
      <ForgotPassword />
    </>
  )
}

export default UserInfo

const ForgotPassword = () => (
  <div className="text-center mt-2">
    <Link id="forgot-password" to="/forgot-password">
      <small>Forgot Password?</small>
    </Link>
  </div>
)

type TProp = {
  onSubmit: (values: any) => void
  isLoading: boolean
}

const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

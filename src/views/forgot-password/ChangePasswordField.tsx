import InputPassword from "@custom-components/InputPassword"
import PasswordValidator from "@custom-components/password-validator"
import useCapsLock from "@hooks/useCapsLock"
import { passwordValidator } from "@utils/index"
import { Button, Form, FormInstance, Popover } from "antd"

const ChangePasswordField = ({ form, loading }: TProps) => {
  const password = Form.useWatch("password", form)
  const capsLockPassword = useCapsLock()
  const capsLock = useCapsLock()

  return (
    <>
      <Popover
        content={<PasswordValidator value={password} />}
        trigger={["focus"]}
        arrow={false}
        placement="right"
        overlayInnerStyle={{ padding: 0, marginLeft: "2rem", width: "20rem" }}
      >
        <Form.Item
          name="password"
          label={<>New Password {capsLock.capsLockMsg}</>}
          rules={[
            {
              required: true,
              min: 8,
              max: 16,
              validator: passwordValidator
            }
          ]}
        >
          <InputPassword {...capsLockPassword} />
        </Form.Item>
      </Popover>

      <Form.Item
        name="newPassword"
        label={<>Confirm New Password {capsLock.capsLockMsg}</>}
        rules={[
          { required: true },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("password") === value) return Promise.resolve()
              return Promise.reject(new Error("Passwords must match!"))
            }
          })
        ]}
      >
        <InputPassword {...capsLock} />
      </Form.Item>
      <Button
        id="submit-password"
        type="primary"
        loading={loading}
        className="mt-1"
        htmlType="submit"
        block
      >
        Submit
      </Button>
    </>
  )
}

export default ChangePasswordField

type TProps = {
  form: FormInstance<any>
  loading: boolean
}

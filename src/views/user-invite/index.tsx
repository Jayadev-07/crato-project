import { ReactNode } from "react"
import { Card, CardBody } from "reactstrap"
import CratoflowFullImg from "@assets/svg/crato-full-img.svg?react"
import { App, Button, Form, Input, Popover } from "antd"
import "@scss/template/react/pages/page-authentication.scss"
import InputPassword from "@custom-components/InputPassword"
import useCapsLock from "@hooks/useCapsLock"
import PasswordValidator from "@custom-components/password-validator"
import { passwordValidator, swalFire } from "@utils/index"
import useFetch from "@hooks/useFetch"
import getUrl from "@api/url"
import usePost from "@hooks/usePost"
import { useLocation, useNavigate } from "react-router-dom"
import SplashScreen from "@custom-components/SplashScreen"
import "@scss/components/company-landing.scss"

type TForm = {
  firstName: string
  lastName: string
  password: string
  newPassword: string
}
const UserInvite = () => {
  const [form] = Form.useForm()
  const password = Form.useWatch("password", form)
  const capsLockPassword = useCapsLock()
  const capsLock = useCapsLock()
  const nav = useNavigate()
  const { pathname } = useLocation()
  const { modal } = App.useApp()
  const token = pathname.split("/").reverse()[0]
  const [data, { isFirstLoad }] = useFetch<TData>(
    getUrl("AUTHAPI", "CRATO_USER", "VALIDATE_TOKEN"),
    {
      apiParams: { method: "post", data: { token } },
      onError: () => linkExpiredErrorModal()
    }
  )
  const { makeRequest, isLoading: loading } = usePost(
    getUrl("AUTHAPI", "CRATO_USER", "ACCEPT_USER"),
    "post",
    { errorToast: false }
  )

  const { makeRequest: resendInvite, isLoading: resendInviteLoading } = usePost(
    undefined,
    "post",
    { errorToast: false }
  )

  const onSubmit = async (d: TForm) => {
    try {
      const { message } = data?.alreadyExists
        ? await resendInvite({
            url: getUrl("AUTHAPI", "CRATO_USER", "ACCEPT_USER_TOKEN") + "/" + token
          })
        : await makeRequest({
            data: {
              token,
              firstName: d.firstName,
              lastName: d.lastName,
              password: d.password
            }
          })
      successModal(message)
    } catch (error) {
      acceptUserErrorModal()
    }
  }

  const linkExpiredErrorModal = async () => {
    modal.warning({
      title: "Your invite is expired",
      width: "800px",
      centered: true,
      okText: "Back to Login",
      okButtonProps: { id: "back-to-login", className: "bg-primary" },
      onOk: () => location.replace(`${location.origin}/login`),
      content: (
        <div>
          We're sorry, but it seems that the invitation link you attempted to use has
          expired. Invitation links are typically valid for 7 days from the time they are
          generated.
          <ul className="mt-1">
            <li>
              Resend invitation : Resend Invitation: If you still wish to join Cratoflow,
              please request a new invitation link from the user who originally invited
            </li>
            <li>
              Contact Support : If you believe this is an error or require further
              assistance, please reach out to our support team for assistance.
            </li>
          </ul>
        </div>
      )
    })
  }

  const acceptUserErrorModal = async () => {
    const { isConfirmed } = await swalFire(
      {
        icon: "error",
        title: "Something went wrong.",
        html: (
          <>
            Please contact support at
            <span className="fw-bolder ms-50">support@cratoflow.com</span>
          </>
        ),
        confirmButtonText: "Okay"
      },
      true
    )
    if (isConfirmed) return nav("/login")
  }
  const successModal = async (text: string) => {
    const { isConfirmed } = await swalFire({
      icon: "success",
      title: "Onboarded successfully",
      text,
      confirmButtonText: "Login"
    })
    if (isConfirmed) return nav("/login")
  }

  if (isFirstLoad) return <SplashScreen />
  if (!data) return <></>
  return (
    <>
      <Wrapper>
        <CratoflowImg />

        <div className={`mb-1 animate__animate   animate__fadeInLeft `}>
          <div
            style={{
              display: "flex",
              gap: ".2rem",
              alignItems: "center",
              margin: ".7rem 0",
              width: "100%"
            }}
          >
            <Form
              form={form}
              onFinish={onSubmit}
              layout="vertical"
              colon={false}
              size="large"
              validateTrigger={["onSubmit"]}
              initialValues={{
                firstName: data.firstName,
                lastName: data.lastName
              }}
              className="w-100"
            >
              <Form.Item
                label="First name"
                name="firstName"
                rules={[{ required: true, message }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Last name"
                name="lastName"
                rules={[{ required: true, message }]}
              >
                <Input />
              </Form.Item>
              {!data.alreadyExists && (
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
                      label={<>New Password {capsLockPassword.capsLockMsg}</>}
                      rules={[
                        {
                          required: !data.alreadyExists,
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
                      { required: !data.alreadyExists },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue("password") === value)
                            return Promise.resolve()
                          return Promise.reject(
                            new Error("Entered passwords did not match")
                          )
                        }
                      })
                    ]}
                  >
                    <InputPassword {...capsLock} iconRender={() => <></>} />
                  </Form.Item>
                </>
              )}
              <Button
                id="submit-password"
                type="primary"
                loading={loading || resendInviteLoading}
                className="mt-1"
                htmlType="submit"
                block
              >
                Continue
              </Button>
            </Form>
          </div>
        </div>
      </Wrapper>
    </>
  )
}

export default UserInvite

const Wrapper = ({ children }: { children: ReactNode }) => (
  <div className="auth-wrapper auth-basic px-2">
    <div className="auth-inner my-2">
      <Card className="mb-0" style={{ overflow: "hidden" }}>
        <CardBody>{children}</CardBody>
      </Card>
    </div>
  </div>
)

const CratoflowImg = () => (
  <CratoflowFullImg
    style={{ marginLeft: "-10px", width: "200px", height: "60px" }}
    className="login-branding"
  />
)

const message = "This field is mandatory."

type TData = {
  alreadyExists: boolean
  firstName: string
  lastName: string
  username: string
}

import { ReactNode, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button, Card, CardBody, Label } from "reactstrap"
import CratoflowFullImg from "@assets/svg/crato-full-img.svg?react"
import { ArrowLeft } from "react-feather"
import { Form, Input, Button as AntdButton, notification } from "antd"

import "@scss/template/react/pages/page-authentication.scss"
import usePost from "@hooks/usePost"
import getUrl from "@api/url"
import OtpField from "./OtpField"
import ChangePasswordField from "./ChangePasswordField"
import { formatedValue } from "@utils/HelperNodes"

const index = () => {
  const navigate = useNavigate()
  const [form] = Form.useForm()

  const [otp, setOtp] = useState<null | string>("")
  const [userName, setUserName] = useState<null | string>("bhupesh.g.4045@gmail.com")
  const [submitButtonName, setSubmitName] = useState<"Send OTP" | "Resend OTP">(
    "Send OTP"
  )
  const [token, setToken] = useState<null | string>(null)
  const [page, setPage] = useState<"EMAIL" | "OTP" | "PASSWORD">("EMAIL")

  const { makeRequest: forgotPasswordApi, isLoading } = usePost(
    getUrl("AUTHAPI", "PASSWORD", "FORGOT")
  )
  const { makeRequest: resendForgotPasswordApi, isLoading: isResendLoading } = usePost(
    getUrl("AUTHAPI", "PASSWORD", "RESEND_FORGOT")
  )
  const { makeRequest: verifyOtpApi, isLoading: isVerifyOtpLoading } = usePost(
    getUrl("AUTHAPI", "PASSWORD", "VERIFY_OTP")
  )
  const { makeRequest: resetPasswordApi, isLoading: isResetLoading } = usePost(
    getUrl("AUTHAPI", "PASSWORD", "RESET")
  )

  const resetStates = () => {
    setToken(null)
    setOtp(null)
    form.resetFields()
    setSubmitName("Send OTP")
  }

  const onEmailSubmit = async (data: any) => {
    try {
      setOtp("")
      const api =
        submitButtonName == "Resend OTP" ? resendForgotPasswordApi : forgotPasswordApi
      await api({ data: { userName: data.email } })
      setPage("OTP")
      setUserName(data.email)
      notification.success({ message: "Email sent succesfully" })
    } catch (error: any) {
      console.log(error)
      notification.error({ message: error?.data?.message ?? "Error in sending email" })
    }
  }

  const onOTPSubmit = async () => {
    try {
      if ((otp?.length ?? 0) < 6 && page == "OTP") {
        notification.error({ message: "Invalid OTP. Please provide valid OTP" })
        return setOtp(null)
      }
      const { token } = await verifyOtpApi({ data: { userName, otp } })
      setToken(token)
      setPage("PASSWORD")
    } catch (error: any) {
      notification.error({ message: error?.data?.message ?? "Error" })
      setOtp(null)
      setPage("EMAIL")
      setSubmitName("Resend OTP")
    }
  }

  const onChangePassword = async (data: any) => {
    try {
      await resetPasswordApi({ data: { userName, token, newPassword: data.newPassword } })
      notification.success({ message: "Password has been reset successfully" })
      resetStates()
      navigate("/login")
    } catch (error: any) {
      notification.error({ message: error?.data?.message ?? "Error" })
    }
  }

  const getHeader = () => {
    if (page == "EMAIL") return <h4 className="mb-0">Forgot Password?</h4>
    if (page == "OTP")
      return (
        <>
          <Label>
            Please enter the OTP sent to{" "}
            <span className="fw-bolder">{formatedValue(25, userName!)}</span>
          </Label>
        </>
      )
  }

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
              margin: ".7rem 0"
            }}
          >
            {page == "EMAIL" && (
              <Button
                id="go-back"
                className="btn-icon rounded-circle"
                style={{ padding: "1px", marginRight: "1px" }}
                color="flat-secondary"
                onClick={() => navigate("/login")}
              >
                <ArrowLeft size={20} />
              </Button>
            )}
            {getHeader()}
          </div>

          <Form
            onFinish={
              page == "EMAIL"
                ? onEmailSubmit
                : page == "OTP"
                ? onOTPSubmit
                : onChangePassword
            }
            form={form}
            layout="vertical"
            colon={false}
            size="large"
            name="forgot-password"
          >
            {page == "EMAIL" && (
              <>
                <Form.Item
                  label="Email"
                  name="email"
                  validateTrigger={["onBlur", "onSubmit"]}
                  rules={[{ required: true, type: "email" }]}
                >
                  <Input />
                </Form.Item>
                <AntdButton
                  loading={isLoading || isResendLoading}
                  type="primary"
                  htmlType="submit"
                  id="send-otp"
                  block
                >
                  {submitButtonName}
                </AntdButton>
              </>
            )}
            {page === "OTP" && (
              <OtpField loading={isVerifyOtpLoading} otp={otp} setOtp={setOtp} />
            )}
            {page == "PASSWORD" && (
              <ChangePasswordField loading={isResetLoading} form={form} />
            )}

            {page != "EMAIL" && (
              <div className="text-center mt-1">
                <Link id="back-to-login" to="/login">
                  Back to login
                </Link>
              </div>
            )}
          </Form>
        </div>
      </Wrapper>
    </>
  )
}

export default index

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

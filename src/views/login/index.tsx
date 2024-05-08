import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { Card, CardBody, CardText } from "reactstrap"
import { ReactNode, useEffect, useState } from "react"
import { Alert, notification } from "antd"
import UserInfo from "./UserInfo"
import TenantInfo from "./TenantInfo"
import CratoflowFullImg from "@assets/svg/crato-full-img.svg?react"
import "@scss/template/react/pages/page-authentication.scss"
import "@src/scss/components/login.scss"
import usePost from "@hooks/usePost"
import getUrl from "@api/url/index"
import { signal } from "@preact/signals-react"
import useCompanyData from "@src/store/companyData"

export const tokenSignal = signal<null | string>(null)
const Login = () => {
  const [isUserDetails, setIsUserDetails] = useState(true)
  const [searchParams, setSearchParams] = useSearchParams({ q: "" })
  const [tenantIdList, setTenantIdList] = useState<TTenantId[]>([])
  const [userInfo, setUserInfo] = useState<{ email: string; password: string } | null>(
    null
  )

  const updateCompanyProfile = useCompanyData((s) => s.updateCompanyProfile)
  const navigate = useNavigate()
  const isSessionloggedOut = searchParams.get("mode")

  const {
    makeRequest: loginApi,
    isLoading,
    data,
    error
  } = usePost<TLogin>(getUrl("AUTHAPI", "AUTH", "LOGIN"), "post", { errorToast: false })

  useEffect(() => {
    if (isSessionloggedOut) {
      notification.warning({ message: "You have been logged out" })
      setSearchParams({}, { replace: true })
    }
  }, [])

  const onSubmit = async (values: any) => {
    const data: TLogin = await loginApi({
      data: {
        userName: values.email,
        password: values.password,
        ...(values.tenantId ? { tenantId: values.tenantId } : {})
      }
    })

    setUserInfo({ email: values.email, password: values.password })
    const hasMultiTenant = data.tenantId?.length ?? 0 > 1

    const handleMultiTenant = () => {
      setTenantIdList(data.tenantId!)
      setIsUserDetails(false)
      updateCompanyProfile({ name: data?.name })
    }
    const handleSingleTenant = () => {
      tokenSignal.value = data.accessToken!
      localStorage.setItem("accessToken", data.accessToken!)
      updateCompanyProfile({ email: values.email })
      navigate("/company-loading")
    }
    if (hasMultiTenant) return handleMultiTenant()
    if (data.accessToken) return handleSingleTenant()
  }

  const handleOnGoBack = () => {
    setIsUserDetails(true)
    localStorage.clear()
  }

  const errorMessage = error?.response?.message
  return (
    <Wrapper>
      <CratoflowImg />

      {isUserDetails && (
        <CardText style={{ whiteSpace: "nowrap", fontSize: "13px" }}>
          Sign-in to your account and simplify your Bookkeeping
        </CardText>
      )}

      {errorMessage && (
        <div id="alert-message">
          <Alert message={errorMessage} type="error" showIcon />
        </div>
      )}

      {isUserDetails ? (
        <UserInfo onSubmit={onSubmit} isLoading={isLoading} />
      ) : (
        <TenantInfo
          onSubmit={(d) => onSubmit({ ...d, ...userInfo })}
          tenantIdList={tenantIdList}
          isLoading={isLoading}
          name={data?.name}
          handleOnGoBack={handleOnGoBack}
        />
      )}
    </Wrapper>
  )
}

export default Login

export const defaultValues = {
  firstName: "",
  lastName: "",
  email: "",
  crato_client_id: ""
}
const Wrapper = ({ children }: { children: ReactNode }) => (
  <div className="auth-wrapper auth-basic px-2" id="login-page">
    <div className="auth-inner my-2">
      <Card className="mb-0" style={{ overflow: "hidden" }}>
        <CardBody>{children}</CardBody>
      </Card>
    </div>
  </div>
)

const CratoflowImg = () => (
  <Link to="/" onClick={(e) => e.preventDefault()}>
    <CratoflowFullImg
      style={{ marginLeft: "-10px", width: "200px", height: "60px" }}
      className="login-branding"
    />
  </Link>
)

type TLogin = Partial<{
  accessToken: string
  preference: TPreference
  tenantId: TTenantId[]
  name: string
}>

type TPreference = {
  layout: string
  menuCollapsed: boolean
}
export type TTenantId = {
  label: string
  value: string
}

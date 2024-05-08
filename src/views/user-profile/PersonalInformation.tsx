import { Button, Radio, Spin } from "antd"
import { Badge, Card, CardBody, Col, Row } from "reactstrap"
import CustomAvatar from "@custom-components/CustomAvatar"
import useFetch from "@hooks/useFetch"
import getUrl from "@api/url"
import SkeletonWrapper from "@custom-components/skeleton/SkeletonWrapper"
import UserCardSkeleton from "@custom-components/skeleton/UserCardSkeleton"
import useCompanyData from "@src/store/companyData"
import { formatedValue } from "@utils/HelperNodes"
import usePost from "@hooks/usePost"
import { useParams } from "react-router-dom"

const PersonalInformation = () => {
  const params = useParams()
  const isUserProfile = !params.email
  const storeEmail = useCompanyData((state) => state.email)
  const email = isUserProfile ? storeEmail : params.email
  console.log({ email, params })
  const [userDetails, { isFirstLoad, refetch }] = useFetch<TUserPersonalInfo>(
    `${getUrl("MASTER_DATA_API", "TENANT_USER", "USER_INFO_USERNAME")}/${email}`
  )

  const { makeRequest: updateLayout, isLoading: isLayoutLoading } = usePost(
    getUrl("AUTHENTICATION_API", "CRATO_USER", "PREFRENCE"),
    "put",
    {
      successToast: true
    }
  )
  const { makeRequest: changeStatus, isLoading: changeStatusLoading } = usePost(
    getUrl("MASTER_DATA_API", "TENANT_USER", "STATUS") + "/" + email,
    "put",
    { successToast: true }
  )
  const { makeRequest: resendInvite, isLoading: resendInviteLoading } = usePost(
    getUrl("MASTER_DATA_API", "TENANT_USER", "RESEND_INVITE_USER") + "/" + email,
    "post",
    { successToast: true }
  )
  const { makeRequest: updateMenuCollapse, isLoading: isMenuCollapseloading } = usePost(
    getUrl("AUTHENTICATION_API", "CRATO_USER", "PREFRENCE"),
    "put",
    {
      successToast: true
    }
  )

  const getStatus = () => {
    if (userDetails?.userStatus == "ACTIVE") return "Deactivate"
    if (userDetails?.userStatus == "IN_ACTIVE") return "Activate"
    return "Resend Invite"
  }

  const updateStatusHandler = async () => {
    const isResendInvite = userDetails?.userStatus == "INVITED"

    if (isResendInvite) await resendInvite()
    else
      await changeStatus({
        params: {
          status: statusMapper[userDetails?.userStatus as keyof typeof statusMapper]
        }
      })
    await refetch()
  }

  return (
    <Card>
      <CardBody>
        <SkeletonWrapper skeleton={<UserCardSkeleton />} loading={isFirstLoad}>
          <div className="user-avatar-section">
            <div className="d-flex align-items-center flex-column">
              <CustomAvatar
                initials
                color={"light-primary"}
                className="rounded mt-1 mb-2"
                content={`${userDetails?.firstName
                  ?.charAt(0)
                  .toUpperCase()} ${userDetails?.lastName?.charAt(0).toUpperCase()}`}
                contentStyles={{
                  borderRadius: 0,
                  fontSize: "calc(48px)",
                  width: "110px",
                  height: "110px"
                }}
              />
              <div className="text-center mb-2">
                <h4 className="fw-bolder">
                  {formatedValue(
                    25,
                    `${userDetails?.firstName ?? ""} ${userDetails?.lastName ?? ""}`
                  )}
                </h4>
                <Badge
                  color={`${
                    userDetails?.statusLabel === "Active"
                      ? "light-success"
                      : "light-danger"
                  } w-100`}
                >
                  {userDetails?.statusLabel ?? ""}
                </Badge>
              </div>
            </div>
          </div>
          <div className="mt-1">
            <h4>Personal Information</h4>
          </div>
          <hr />
          <Row tag="dl" className="mb-0">
            <Col tag="dt" sm="6" md="5" className="fw-bolder mb-1">
              First Name:
            </Col>
            <Col tag="dd" sm="6" md="7" className="mb-1">
              {formatedValue(17, userDetails?.firstName)}
            </Col>
            <Col tag="dt" sm="6" md="5" className="fw-bolder mb-1">
              Last Name:
            </Col>
            <Col tag="dd" sm="6" md="7" className="mb-1">
              {formatedValue(17, userDetails?.lastName)}
            </Col>
            <Col tag="dt" sm="6" md="5" className="fw-bolder mb-1">
              Email:
            </Col>
            <Col tag="dd" sm="6" md="7" className="mb-1">
              {formatedValue(17, userDetails?.userName)}
            </Col>
            {isUserProfile && (
              <>
                <Col tag="dt" sm="6" md="5" className="fw-bolder mb-1">
                  Layout:
                </Col>
                <Col tag="dd" sm="6" md="7" className="mb-1">
                  <Spin spinning={isLayoutLoading}>
                    <Radio.Group
                      options={layoutOptions}
                      onChange={async ({ target }) => {
                        await updateLayout({
                          data: {
                            layout: mapper[target.value as keyof typeof mapper],
                            menuCollapsed:
                              target.value === "HORIZONTAL"
                                ? true
                                : userDetails?.preference?.menuCollapsed
                          }
                        })
                        refetch()
                      }}
                      value={userDetails?.preference?.layout ?? "Vertical"}
                      optionType="button"
                      buttonStyle="solid"
                    />
                  </Spin>
                </Col>
                {userDetails?.preference?.layout !== horizontal ? (
                  <>
                    <Col tag="dt" sm="6" md="5" className="fw-bolder mb-1">
                      Menu:
                    </Col>
                    <Col tag="dd" sm="6" md="7" className="mb-1">
                      <Spin spinning={isMenuCollapseloading}>
                        <Radio.Group
                          options={menuOptions}
                          onChange={async ({ target }) => {
                            await updateMenuCollapse({
                              data: { menuCollapsed: target.value }
                            })
                            refetch()
                          }}
                          value={userDetails?.preference?.menuCollapsed}
                          optionType="button"
                          buttonStyle="solid"
                        />
                      </Spin>
                    </Col>
                  </>
                ) : (
                  <div className="py-1"></div>
                )}
              </>
            )}

            {!isUserProfile && (
              <div className="text-center">
                <Button
                  type="primary"
                  loading={changeStatusLoading || resendInviteLoading}
                  onClick={updateStatusHandler}
                >
                  {getStatus()}
                </Button>
              </div>
            )}
          </Row>
        </SkeletonWrapper>
      </CardBody>
    </Card>
  )
}

export default PersonalInformation

type TUserPersonalInfo = {
  firstName: string
  lastName: string
  userName: string
  statusLabel: string
  preference: Preference
  userStatus: string
}
type Preference = {
  layout: string
  menuCollapsed: boolean
}

const horizontal = "Horizontal"

const menuOptions = [
  { label: "Collapsed", value: true },
  { label: "Expanded", value: false }
]
const layoutOptions = [
  { label: "Horizontal", value: "Horizontal" },
  { label: "Vertical", value: "Vertical" }
]

const mapper = {
  Horizontal: "HORIZONTAL",
  Vertical: "VERTICAL"
}

const statusMapper = {
  IN_ACTIVE: "ACTIVE",
  ACTIVE: "IN_ACTIVE"
}

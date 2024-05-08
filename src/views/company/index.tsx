import getUrl from "@api/url"
import useFetch from "@hooks/useFetch"
import usePost from "@hooks/usePost"
import useCompanyData from "@src/store/companyData"
import { Skeleton, notification } from "antd"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Badge, Button, Card, CardBody, Col, Row, Spinner } from "reactstrap"

const CompanyManagement = () => {
  const navigate = useNavigate()
  const [companyId, setCompanyId] = useState<string | null>(null)

  const updateCompanyProfile = useCompanyData((s) => s.updateCompanyProfile)

  const [clients = {} as any, { loading }] = useFetch(
    getUrl("MASTER_DATA_API", "TENANT_USER", "USER_DETAILS")
  )

  const { makeRequest, isLoading } = usePost(
    getUrl("MASTER_DATA_API", "TENANT_USER", "USER_DETAILS"),
    "get"
  )

  const onEnterCompany = async (companyId: string) => {
    try {
      const data = await makeRequest({ params: { companyId } })
      updateCompanyProfile(data.companyInfo)
      navigate("/dashboard")
    } catch (error: any) {
      setCompanyId(null)
      notification.error({
        message: error?.message ?? "Something went wrong, please try again later"
      })
    }
  }

  if (loading) return <Loader />
  return (
    <div id="company-page">
      <Header />
      <Row className="match-height">
        {clients?.companyList?.map((client: TCompany, index: number) => {
          return (
            <Col key={index} xl={4} md={6}>
              <Card>
                <CardBody>
                  <div
                    style={{
                      position: "absolute",
                      right: "20px",
                      top: "10px"
                    }}
                  >
                    <Badge color="light-danger" pill>
                      {client.companyMode === "TEST" ? "Test Company" : ""}
                    </Badge>
                  </div>

                  <div
                    style={{ flexWrap: "wrap" }}
                    className="d-flex justify-content-between align-items-end mt-1 pt-25"
                  >
                    <div className="role-heading">
                      <h4 className="fw-bolder">{client.companyName}</h4>
                    </div>
                    <Button
                      color="primary"
                      size="sm"
                      id={client.companyName}
                      disabled={client?.companyId == companyId || isLoading}
                      onClick={() => {
                        setCompanyId(client.companyId)
                        onEnterCompany(client.companyId)
                      }}
                    >
                      {client.companyId == companyId ? (
                        <span>
                          <Spinner size="sm" /> Entering..
                        </span>
                      ) : (
                        "Enter"
                      )}
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </Col>
          )
        })}
      </Row>
    </div>
  )
}

export default CompanyManagement

// type ClientDetailsType = ClientDetailsItemType[]

// interface ClientDetailsItemType {
//   clientId: string
//   clientName: string
//   clientCode: string
//   companyType?: string
// }

const Header = () => (
  <>
    <h3>Select your company</h3>
    <p className="mb-2">
      To carry out necessary tasks within the company, choose the appropriate company from
      the list below.
    </p>
  </>
)
const Loader = () => (
  <>
    <Header />
    <Row>
      {new Array(3).fill(
        <Col xl={4} md={6}>
          <Card>
            <CardBody>
              <div className="d-flex justify-content-between">
                <Skeleton.Input active block />
                <Skeleton.Button active className="ms-3" />
              </div>
            </CardBody>
          </Card>
        </Col>
      )}
    </Row>
  </>
)

type TCompany = {
  companyId: string
  companyName: string
  companyMode?: null | "TEST"
}

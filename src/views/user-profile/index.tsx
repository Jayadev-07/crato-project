import { useEffect, useState } from "react"
import { TabContent, TabPane, Col, Row } from "reactstrap"
import UserTab from "./UserTab"
import PersonalInformation from "./PersonalInformation"
import Security from "./Security"

import AccountTab from "./account"
import { signal } from "@preact/signals-react"
import { useParams } from "react-router-dom"

export const isfromUserProfileSignal = signal(false)

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState<number>(1)
  const isUserProfile = !useParams()?.email
  useEffect(() => {
    isfromUserProfileSignal.value = isUserProfile
  }, [])
  return (
    <div>
      <Row>
        <Col xl="3" lg="6" xs={{ order: 1 }} md={{ order: 0, size: 5 }}>
          <PersonalInformation />
        </Col>
        <Col xl="9" lg="8" xs={{ order: 0 }} md={{ order: 1, size: 7 }}>
          <UserTab activeTab={activeTab} toggleTab={setActiveTab} />

          <TabContent activeTab={activeTab}>
            <TabPane tabId={1}>
              <AccountTab />
            </TabPane>
            {isUserProfile && (
              <TabPane tabId={2}>
                <Security />
              </TabPane>
            )}
          </TabContent>
        </Col>
      </Row>
    </div>
  )
}

export default UserProfile

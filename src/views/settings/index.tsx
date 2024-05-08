import { useState } from "react"
import { ChevronLeft, ChevronsRight, Search } from "react-feather"
import { Link, useNavigate } from "react-router-dom"
import {
  Card,
  CardBody,
  CardText,
  Col,
  Input,
  InputGroup,
  InputGroupText,
  ListGroup,
  ListGroupItem,
  Row
} from "reactstrap"
import bgLeftImage from "@assets/svg/settings.svg"
import bgRightImage from "@assets/svg/settings_2.svg"
import settingsRoute from "./settingsRoute"

import "@scss/template/react/pages/page-knowledge-base.scss"
import type { TRoute } from "./settingsRoute.type"

const Settings = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const navigate = useNavigate()

  const Content = (item: TContent) => {
    const { children, icon: Icon, title } = item
    return (
      <Col lg="4" sm="6">
        <Card style={{ minHeight: "300px" }}>
          <div
            onClick={() => navigate(-1)}
            style={{
              color: "#34A353",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              position: "fixed",
              top: "1.2rem",
              left: "1.2rem"
            }}
          >
            <ChevronLeft size={24} />
            <span style={{ fontSize: "15px" }} id="back-btn">
              Back
            </span>
          </div>
          <CardBody id={`${title} card`}>
            <h6 className="kb-title" id={`title ${item.title}`}>
              <Icon size={20} className="me-50" style={{ color: "grey" }} />
              <span>
                {item.title} {`(${children.length})`}
              </span>
            </h6>
            <ListGroup className="mt-1 ms-50">
              {children.map((listItem, id) => {
                return (
                  <ListGroupItem
                    style={{ border: "none" }}
                    tag={Link}
                    to={listItem.navLink}
                    className="text-body"
                    key={id}
                    id={`${listItem.title}`}
                  >
                    <ChevronsRight
                      style={{ marginRight: "3px", marginBottom: "3px" }}
                      size={16}
                    />
                    {listItem.title}
                  </ListGroupItem>
                )
              })}
            </ListGroup>
          </CardBody>
        </Card>
      </Col>
    )
  }

  const renderContent = () => {
    const filteredList = settingsRoute.filter(
      (val) =>
        val.title.toLowerCase().includes(searchTerm) ||
        val.children.filter((obj) => obj.title.toLowerCase().includes(searchTerm)).length
    )
    return filteredList.map((item, id) => <Content {...item} key={id} />)
  }

  return (
    <>
      <div>
        <Card
          style={{
            backgroundColor: "#e2f5e6",
            backgroundImage: `url(${bgLeftImage}), url(${bgRightImage})`,
            backgroundPosition: "10% 2rem, 80% 2rem",
            backgroundRepeat: "no-repeat",
            backgroundSize: "200px 200px,150px 150px"
          }}
        >
          <CardBody
            style={{ height: "200px" }}
            className="d-flex align-items-center justify-content-center"
          >
            <div>
              <h1 className="text-primary text-center" id="settings-title">
                Settings
              </h1>
              <CardText className="text-center">
                Setup your preferences and configure each modules
              </CardText>
              <InputGroup className="input-group-merge" style={{ width: "576px" }}>
                <InputGroupText>
                  <Search size={14} />
                </InputGroupText>
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value?.toLowerCase())}
                  placeholder="Go to..."
                  id="settings-search"
                />
              </InputGroup>
            </div>
          </CardBody>
        </Card>
      </div>

      <Row className="kb-search-content-info match-height">{renderContent()}</Row>
    </>
  )
}

export default Settings

type TContent = TRoute

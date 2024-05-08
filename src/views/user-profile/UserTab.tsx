import React from "react"
import { Bell, Lock, User, X } from "react-feather"
import { Button, Nav, NavItem, NavLink } from "reactstrap"
import { useNavigate, useParams } from "react-router-dom"

type TUserTab = {
  activeTab: number
  toggleTab: (actveId: number) => void
}

const UserTab: React.FC<TUserTab> = ({ activeTab, toggleTab }) => {
  const isUserProfile = !useParams().email
  const navigate = useNavigate()

  return (
    <div>
      <Nav pills className="mb-2">
        <NavItem>
          <NavLink active={activeTab === 1} onClick={() => toggleTab(1)}>
            <User size={18} className="me-50" />
            <span className="fw-bold" id="account">
              Account
            </span>
          </NavLink>
        </NavItem>
        {isUserProfile && (
          <NavItem>
            <NavLink active={activeTab === 2} onClick={() => toggleTab(2)}>
              <Lock size={18} className="me-50" />
              <span className="fw-bold" id="security">
                Security
              </span>
            </NavLink>
          </NavItem>
        )}
        <NavItem>
          <NavLink active={activeTab === 3} onClick={() => toggleTab(3)}>
            <Bell size={18} className="me-50" />
            <span className="fw-bold" id="timeline">
              Timeline
            </span>
          </NavLink>
        </NavItem>
      </Nav>
      <Button
        color="flat-primary"
        size="sm"
        style={{ position: "absolute", top: 0, right: 0 }}
        onClick={() => navigate(-1)}
        id="breadcrumbs-close"
      >
        <X />
      </Button>
    </div>
  )
}

export default UserTab

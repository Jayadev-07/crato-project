import {
  Button,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown
} from "reactstrap"
import { Pocket, Settings, Box, User, Power } from "react-feather"
import { useNavigate } from "react-router-dom"
import "@src/scss/components/right-nav.scss"
import { Avatar } from "antd"
import defaultAvatar from "@assets/images/user-avatar.png"
import useCombineStore from "@hooks/useCombineStore"
import { superUserRouteList } from "."
import useCompanyData from "@src/store/companyData"
import { SafetyOutlined, UsergroupAddOutlined } from "@ant-design/icons"
import { getCompanyId } from "@utils/index"

const RightNav = () => {
  const navigate = useNavigate()
  const { onLogout, onSwitchCompany } = useCombineStore()
  const accessToken = localStorage.getItem("accessToken")
  const showSuperUserMenu = superUserRouteList.includes(location.pathname) && accessToken
  const name = useCompanyData((s) => s.name)
  const companyCount = useCompanyData((s) => s.companyCount)

  const logout = () => {
    onLogout()
    navigate("/login")
  }

  const handleSwitchCompany = () => {
    navigate("/company")
    onSwitchCompany()
  }

  const hasAccess = !showSuperUserMenu && companyCount > 1

  const buttonList = [
    {
      name: "Beta",
      onClickHandler: () => navigate("/beta"),
      Icon: Pocket,
      color: "flat-danger"
    },
    {
      name: "Settings",
      onClickHandler: () => navigate("/settings"),
      Icon: Settings,
      color: "flat-success"
    },
    {
      name: "My Box",
      onClickHandler: () => navigate("/my-box"),
      Icon: Box,
      color: "flat-success"
    }
  ].filter(() => !showSuperUserMenu && getCompanyId())
  return (
    <ul className="nav navbar-nav align-items-center ms-auto">
      {buttonList.map(({ name, onClickHandler, Icon, color }, id) => (
        <Button
          id={name}
          color={color}
          className="transition-button"
          onClick={onClickHandler}
          key={id}
        >
          <span>{name}</span>
          <Icon size={20} />
        </Button>
      ))}

      <UncontrolledDropdown
        tag="li"
        className="dropdown-user nav-item"
        style={{ fontSize: ".9rem" }}
        id="profile-icon"
      >
        <DropdownToggle
          href="/"
          tag="a"
          id="profile"
          className="nav-link dropdown-user-link"
          onClick={(e) => e.preventDefault()}
        >
          {/* <Badge dot color="green"> */}
          <Avatar
            // shape="square"
            size={34}
            src={<img src={defaultAvatar} width={30} height={30} />}
          />
          {/* </Badge> */}
        </DropdownToggle>
        <DropdownMenu
          id="profile-list"
          end
          style={{ width: "15rem", minHeight: "15rem" }}
        >
          <div>
            <div
              id="avatar"
              className="d-flex align-items-center mt-1 justify-content-center"
            >
              <Avatar
                // shape="square"
                size={64}
                src={<img src={defaultAvatar} width={30} height={30} />}
              />
            </div>

            <div>
              <div className="text-center my-50 fs-4 fw-bold">{name && name}</div>
            </div>
            {/* {isValidUrl && <div className="text-center">{roleNames[0]}</div>} */}

            <hr className="border-bottom border-2" />

            <DropdownItem
              id="user-management"
              className="w-100"
              onClick={() => navigate(`/user-management`)}
            >
              <UsergroupAddOutlined size={14} />
              <span className="align-middle ms-50">User Management</span>
            </DropdownItem>
            <DropdownItem
              id="role-management"
              className="w-100"
              onClick={() => navigate(`/role-management`)}
            >
              <SafetyOutlined size={14} />
              <span className="align-middle ms-50">Role Management</span>
            </DropdownItem>
            <hr className="border-bottom border-2" />

            <DropdownItem
              id="user-profile"
              className="w-100"
              onClick={() => navigate(`/user-profile`)}
            >
              <User size={14} />
              <span className="align-middle ms-50">Profile</span>
            </DropdownItem>
            {hasAccess && (
              <DropdownItem
                id="switch-company"
                className="w-100"
                onClick={handleSwitchCompany}
              >
                <User size={14} />
                <span className="align-middle ms-50">Switch Company</span>
              </DropdownItem>
            )}
            <DropdownItem
              id="log-out"
              className="w-100"
              onClick={(e) => {
                e.preventDefault()
                logout()
              }}
            >
              <Power size={14} />
              <span className="align-middle ms-50">Log Out</span>
            </DropdownItem>
          </div>
        </DropdownMenu>
      </UncontrolledDropdown>
    </ul>
  )
}

export default RightNav

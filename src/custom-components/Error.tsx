import CratoflowLogo from "@assets/images/logo-full.png"
import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "react-feather"
import { Button } from "reactstrap"
import Logo from "@assets/svg/warning.svg?react"
import "@scss/template/react/pages/page-misc.scss"

const Error = () => {
  const navigate = useNavigate()
  return (
    <div className="misc-wrapper">
      <a className="brand-logo" href="/">
        <img src={CratoflowLogo} alt="Cratoflow Branding Logo" width="220px" />
      </a>
      <div className="misc-inner p-2 p-sm-3">
        <div className="w-100 text-center">
          <h2 className="mb-1">Something went wrong</h2>
          <p className="mb-2">
            Oops! Please try again. If the issue persists, contact your system
            administrator.
          </p>
          <div className="d-flex align-items-center justify-content-center">
            <Button
              onClick={() => {
                navigate(-1)
                location.reload()
              }}
              color="primary"
              size="sm"
              className="mb-2 d-block text-center"
            >
              <ArrowLeft /> &nbsp; Go Home
            </Button>
          </div>
          <Logo className="img-fluid" style={{ marginTop: "4rem" }} />
        </div>
      </div>
    </div>
  )
}
export default Error

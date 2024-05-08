import { useNavigate } from "react-router-dom"
import { Button } from "reactstrap"
import cratoflowFullLogo from "@assets/images/logo-full.png"
import ErrorSvg from "@assets/svg/error.svg?react"
import { ArrowLeft } from "react-feather"
import "@scss/template/react/pages/page-misc.scss"

const PageNotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="misc-wrapper">
      <a className="brand-logo" href="/">
        <img src={cratoflowFullLogo} alt="Cratoflow Branding Logo" width="220px" />
      </a>
      <div className="misc-inner p-2 p-sm-3">
        <div className="w-100 text-center">
          <h2 className="mb-1">Page Not Found 🕵🏻‍♀️</h2>
          <p className="mb-2">Oops! The requested URL was not found on cratoflow.</p>
          <Button
            onClick={() => navigate(-1)}
            color="primary"
            className="btn-sm-block mb-2"
          >
            <ArrowLeft /> &nbsp; Go Back
          </Button>
          <ErrorSvg className="img-fluid" />
        </div>
      </div>
    </div>
  )
}
export default PageNotFound

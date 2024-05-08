import { X } from "react-feather"
import { Link, useNavigate } from "react-router-dom"
import { Breadcrumb, BreadcrumbItem, Button } from "reactstrap"
type PropType = {
  data: { link?: string; title: string }[]
  title: string
  home?: string
  noHome?: boolean
  withGoBack?: boolean
  backUrl?: any
}
const Breadcrumbs = ({
  data,
  title,
  home,
  noHome,
  withGoBack,
  backUrl = -1
}: PropType) => {
  const navigate = useNavigate()

  const renderBreadCrumbs = () => {
    return data.map((item, index) => {
      const isLastItem = data.length - 1 === index
      return (
        <BreadcrumbItem tag={item.link ? "li" : "span"} key={index} active={isLastItem}>
          {item.link ? (
            <Link to={item.link} id={`link-${index}`}>
              {item.title}
            </Link>
          ) : (
            <>
              <span id={`link-${index}`}>{item.title}</span>
            </>
          )}
        </BreadcrumbItem>
      )
    })
  }

  return (
    <div className={`content-header-left ${withGoBack ? "" : "col-md-9"} col-12 mb-50`}>
      <div className="row breadcrumbs-top">
        <div className={`${withGoBack ? " col-10" : " col-12"}`}>
          {title ? (
            <h2
              className={`content-header-title float-start mb-0 ${noHome ? "me-50" : ""}`}
            >
              {title}
            </h2>
          ) : (
            ""
          )}
          <div className="breadcrumb-wrapper vs-breadcrumbs d-sm-block d-none col-12">
            <Breadcrumb>
              {noHome ? (
                <></>
              ) : (
                <BreadcrumbItem
                  tag="li"
                  onClick={() => {
                    home ? navigate(home) : navigate("/dashboard")
                  }}
                  className="mb-1 ms-1 cursor-pointer text-primary"
                >
                  <div id={"link-0"}>Home</div>
                </BreadcrumbItem>
              )}
              {renderBreadCrumbs()}
            </Breadcrumb>
          </div>
        </div>
        <div className={`${withGoBack ? " col-2 text-end px-1" : "d-none"}`}>
          <Button
            color="flat-primary"
            size="sm"
            onClick={() => navigate(backUrl)}
            id="breadcrumbs-close"
          >
            <X />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Breadcrumbs

import useLayoutStore from "@src/store/layout"
import classNames from "classnames"

const FooterComponent = () => {
  const footerType = useLayoutStore((state) => state.footerType)
  return (
    <footer
      className={classNames(
        `footer footer-light ${
          footerClasses[footerType as keyof typeof footerClasses] || "footer-static"
        }`,
        {
          "d-none": footerType === "hidden"
        }
      )}
    >
      <p className="clearfix mb-0">
        <span className="float-md-start d-block d-md-inline-block mt-25">
          COPYRIGHT © {new Date().getFullYear()}{" "}
          <a href="https://www.cratoflow.com" target="_blank" rel="noopener noreferrer">
            Cratoflow
          </a>
          <span className="d-none d-sm-inline-block">, All rights Reserved</span>
        </span>
        {/* <span className='float-md-end d-none d-md-block'>
            Hand-crafted & Made with
            <Heart size={14} />
          </span> */}
      </p>
    </footer>
  )
}

export default FooterComponent

const footerClasses = {
  static: "footer-static",
  sticky: "footer-fixed",
  hidden: "footer-hidden"
}

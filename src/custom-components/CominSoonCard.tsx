import { Card } from "reactstrap"
import ComingSoonLogo from "@assets/svg/under-construction.svg?react"
import themeConfig from "@assets/data/themeConfig"
const primary = themeConfig.color
const CominSoon = ({ title = "New charts coming soon" }) => {
  return (
    <Card>
      <ComingSoonLogo
        style={{ height: "330px", padding: "1rem  0", marginLeft: "5rem" }}
      />
      <h2 style={{ color: primary, paddingBottom: "1rem" }} className="text-center">
        {title}
      </h2>
    </Card>
  )
}

export default CominSoon

import type { Children, TSettingRoute } from "./settingsRoute.type"
import { Book } from "react-feather"

const BASE_ROUTE = "/settings"
const mapper = (d: Children, route: string) => ({
  ...d,
  navLink: `${BASE_ROUTE}/${route}/${d.navLink}`
})
const Routes: TSettingRoute = [
  {
    id: "",
    icon: Book,
    title: "Master Data",
    children: [
      {
        id: "",
        navLink: "company-profile",
        title: "Company Profile"
      },
      {
        id: "",
        navLink: "chart-of-accounts",
        title: "Chart of Accounts"
      },
      {
        id: "",
        navLink: "corporate-structure",
        title: "Corporate Structure"
      }
    ].map((d) => mapper(d, "master-data"))
  }
]

export default Routes

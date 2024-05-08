import { Home } from "react-feather"
import expenses from "./expenses"

export default [
  {
    title: "Dashboard",
    icon: Home,
    navLink: "/dashboard"
  },
  ...expenses
]

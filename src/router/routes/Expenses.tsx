import { RouterType } from "@src/types/router"
import { lazy } from "react"

const VendorList = lazy(() => import("@views/expense/vendor/index"))
const ApplyPayments = lazy(() => import("@views/expense/payments/apply-payments"))

const baseRoute = "/expense"
const Expenses: RouterType = [
  {
    accessMap: "Exp_Vendor_Management",
    path: baseRoute + "/vendors",
    element: <VendorList />,
    meta: {
      restricted: true,
      accessRestricted: true
    }
  },
  {
    path: baseRoute + "/payments/apply-payments",
    element: <ApplyPayments />,
    meta: {
      restricted: true
    }
  }
]

export default Expenses

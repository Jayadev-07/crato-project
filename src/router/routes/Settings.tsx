import type { RouterItem, RouterType } from "@src/types/router"

import { lazy } from "react"
const CorporateStructure = lazy(() => import("@views/corporate-structure"))

const CompanyProfile = lazy(() => import("@views/settings/master-data/company-profile"))
const BankingIntegration=lazy(()=>import("@views/settings/integration/banking-integration"))
const ChartOfAccounts = lazy(
  () => import("@views/settings/master-data/chart-of-accounts")
)
const SettingsPage = lazy(() => import("@views/settings/index"))

const BASE_ROUTE = "/settings"
const mapper = (d: RouterItem, route: string) => ({
  ...d,
  path: `${BASE_ROUTE}/${route}/${d.path}`
})

const MasterData: RouterType = [
  {
    accessMap: "",
    path: "company-profile",
    element: <CompanyProfile />,
    meta: {
      restricted: true
    }
  },
  {
    accessMap: "",
    path: "chart-of-accounts",
    element: <ChartOfAccounts />,
    meta: {
      restricted: true
    }
  },
  {
    accessMap: "",
    path: "corporate-structure",
    element: <CorporateStructure />,
    meta: {
      restricted: true
    }
  }
].map((d) => mapper(d, "master-data"))

const Integration: RouterType = [
  {
    accessMap: "",
    path: "banking-integration",
    element: <BankingIntegration />,
    meta: {
      restricted: true
    }
  }
].map((d) => mapper(d, "integration"))
const Settings: RouterType = [
  {
    accessMap: "",
    path: BASE_ROUTE,
    element: <SettingsPage />,
    meta: {
      restricted: true
    }
  },
  ...MasterData,
  ...Integration
]

export default Settings

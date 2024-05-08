import { RouterItem } from "@src/types/router"

const isProduction = import.meta.env.VITE_ENVIRONMENT == "production"

export const inactiveRoute = [
  "/ap/expense/create-invoice",
  "/ap/expense/create-credit-memo",
  // ** revenue
  "/ar/salesdashboard/list",
  "/ar/salesdashboard/sales-input/list",
  "/ar/salesdashboard/sales-order/list",
  // "/reportings",

  "/ap/settings/revenue/customize-template",

  //banking
  "/cratomatch/uncategorized-transactions-cu",
  "/cratomatch/categorized-transactions-cu/list",
  "/cratomatch/bank-reconciliation",

  //cratoledge
  "/ledger/general-ledger",

  // ** Settings Cratobot

  // ** Settings Integration

  "/cratomatch/settings/pos-system",
  "/pos-redirect",

  // ** Settings Cratomatch
  "/settings/accountingList",
  "/cratomatch/settings/pos-system",
  "/settings/banking/bank-recon/list",
  "/settings/ledger/general-ledger",
  //setting expense
  // "/ap/cratopay/configuration",
  "/ap/settings/expenses/reminder",
  // ** Settings Revenue
  "/ap/settings/revenue/customize-template2",
  "/beta"
]

export const routeFilterCheck = (route: RouterItem) =>
  isProduction ? !inactiveRoute.includes(route.path) : route

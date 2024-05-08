import PageNotFound from "@custom-components/PageNotFound"
import UnAuthorized from "@custom-components/UnAuthorized"
import { RouterType } from "@src/types/router"
import { App } from "antd"
import { lazy } from "react"

const Login = lazy(() => import("@views/login"))
const ForgotPassword = lazy(() => import("@views/forgot-password/index"))
const CompanyLoading = lazy(() => import("@views/company/Loading"))
const UserInvite = lazy(() => import("@views/user-invite"))

const UnAuthenticatedRoute: RouterType = [
  {
    path: "*",
    element: <PageNotFound />,
    meta: {
      layout: "blank"
    }
  },
  {
    path: "/login",
    element: <Login />,
    meta: {
      layout: "blank",
      publicRoute: true
    }
  },

  {
    path: "/company-loading",
    element: <CompanyLoading />,
    meta: {
      layout: "blank",
      publicRoute: false
    }
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
    meta: {
      layout: "blank",
      publicRoute: true
    }
  },
  {
    path: "/user-invite/:token",
    element: (
      <App>
        <UserInvite />
      </App>
    ),
    meta: {
      layout: "blank",
      publicRoute: true
    }
  },
  {
    path: "/unauthorized",
    element: <UnAuthorized />,
    meta: {
      layout: "blank",
      publicRoute: true
    }
  }
]

export default UnAuthenticatedRoute

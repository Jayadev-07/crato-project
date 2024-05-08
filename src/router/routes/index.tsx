import Expenses from "./Expenses"
import Settings from "./Settings"
import { RouterItem, RouterType } from "@src/types/router"
import useLayoutStore from "@src/store/layout"
import Layout from "@src/layout"
import { LayoutType } from "@src/types/store/layout"
import { routeFilterCheck } from "./utils"
import RouterWrapper from "../RouterWrapper"
import UnAuthenticatedRoute from "./UnAuthenticatedRoute"

import { isObjEmpty } from "@utils/index"
import LayoutWrapper from "@src/layout/LayoutWrapper"
import { Fragment, lazy } from "react"
import { tokenSignal } from "@views/login/index"
import AddRole from "@views/role-management/add-role"
import { UserManagementRoutes } from "./UserManagementRoutes"

const Dashboard = lazy(() => import("@views/dashboard"))
const CompanyManagement = lazy(() => import("@views/company"))
const UserProfile = lazy(() => import("@views/user-profile"))

const Roles = lazy(() => import("@views/role-management"))

const routes: RouterType = [
  {
    path: "/company",
    element: <CompanyManagement />,
    meta: {
      restricted: true,
      menuHidden: true
    }
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
    meta: {
      restricted: true
    }
  },
  {
    path: "/create-role",
    element: <AddRole />,
    meta: {
      restricted: true,
      menuHidden: true
    }
  },
  {
    path: "/edit-role/:id",
    element: <AddRole />,
    meta: {
      restricted: true,
      menuHidden: true
    }
  },
  {
    path: "/role-management",
    element: <Roles />,
    meta: {
      restricted: true,
      menuHidden: true
    }
  },
  {
    path: "/user-profile",
    element: <UserProfile />,
    meta: {
      restricted: true,
      menuHidden: true
    }
  },
  ...UserManagementRoutes,
  ...UnAuthenticatedRoute,
  ...Expenses,
  ...Settings
]

const getRouteMetaData = (route: RouterItem) => {
  if (!isObjEmpty(route.element.props)) return
  if (route.meta) return { routeMeta: route.meta }
  return {}
}

const getElementWrapper = (route: RouterItem) => {
  const isBlank = route.meta?.layout == "blank"
  const isLayoutWrapperNeed = isObjEmpty(route.element.props) && isBlank === false
  const Wrapper = isLayoutWrapperNeed ? LayoutWrapper : Fragment

  const element = (
    <Wrapper {...(isBlank === false ? getRouteMetaData(route) : {})}>
      <RouterWrapper route={route}>{route.element}</RouterWrapper>
    </Wrapper>
  )
  return { ...route, element }
}

const MergeLayoutRoutes = (layout: LayoutType, defaultLayout: LayoutType) => {
  const filteredRoutes = routes.filter(routeFilterCheck)
  if (!filteredRoutes.length) return []

  return filteredRoutes
    .filter((route: RouterItem) => {
      const isUserLayoutMatch = route.meta?.layout === layout
      const isDefaultLayoutMatch =
        (route.meta === undefined || route.meta.layout === undefined) &&
        defaultLayout === layout
      return isUserLayoutMatch || isDefaultLayoutMatch
    })
    .map(getElementWrapper)
}

const accessedRoutes = () => {
  const layout = useLayoutStore.getState().layout

  const defaultLayout = layout || "vertical"
  const layouts = ["vertical", "horizontal", "blank"]

  const allRoutes = layouts.map((layoutItem) => {
    const children = MergeLayoutRoutes(
      layoutItem as LayoutType,
      defaultLayout as LayoutType
    )
    return {
      path: "/",
      element: <Layout layout={(layoutItem || defaultLayout) as LayoutType} />,
      children
    }
  })

  return allRoutes
}

export const generatedRoutes = () => {
  const hasAccessToken = tokenSignal.value || localStorage.getItem("accessToken")
  if (hasAccessToken) return accessedRoutes()
  const children = UnAuthenticatedRoute.map(getElementWrapper)
  return [
    {
      path: "/",
      // element: (
      //   <>
      //     <Navigate to={localStorage.getItem("accessToken") ? "/dashboard" : "/login"} />
      //     <Layout layout={"blank"} />,
      //   </>
      // ),
      children
    }
  ]
}

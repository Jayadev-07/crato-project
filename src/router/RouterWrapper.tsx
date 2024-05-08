import { RouterItem } from "@src/types/router"
import { Navigate } from "react-router-dom"
import { ReactNode } from "react"

const RouterWrapper = ({ route, children }: Props) => {
  if (localStorage.getItem("accessToken"))
    return route.meta?.publicRoute && route.path !== "/login" ? (
      <Navigate to={"/dashboard"} />
    ) : (
      children
    )

  return route.meta?.publicRoute ? children : <Navigate to={"/unauthorized"} />
}

export default RouterWrapper

type Props = { route: RouterItem; children: ReactNode }

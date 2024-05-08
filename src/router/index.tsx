import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { generatedRoutes } from "./routes"
// import useLayoutStore from "@src/store/layout"
import { useEffect } from "react"
import { tokenSignal } from "@views/login/index"

const basename = import.meta.env.VITE_BASE_NAME
const AppRouter = () => {
  // const layout = useLayoutStore((state) => state.layout)
  // const localStorage = tokenSignal.value
  const routes = generatedRoutes()

  const router = createBrowserRouter(routes, { basename })

  const setLocalStorage = () => {
    tokenSignal.value = null
  }
  // console.log(layout, localStorage)
  // console.clear()
  useEffect(() => {
    addEventListener("storage", setLocalStorage)
    return () => removeEventListener("storage", setLocalStorage)
  }, [])

  // TODO LOADING
  return <RouterProvider router={router} />
}

export default AppRouter

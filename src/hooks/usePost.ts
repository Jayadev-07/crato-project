import { useState, useCallback } from "react"
import api from "@api/index"
import { AxiosRequestConfig } from "axios"
import { notification } from "antd"

const usePost = <T>(url?: string, method: MethodType = "post", toast?: TToastType) => {
  const { successToast = false, errorToast = true } = toast ?? {}
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<any>()
  const [data, setData] = useState<T>()

  const makeRequest = useCallback(
    async (config?: AxiosRequestConfig, pathVariable?: string) => {
      setIsLoading(true)
      setError(null)
      try {
        const { data } = await api({
          method,
          url: `${url}${pathVariable ? `/${pathVariable}` : ""}`,
          ...config
        })
        setData(data)
        if (successToast) notification.success({ message: data?.message ?? "Success" })
        return data
      } catch (error: any) {
        if (errorToast)
          notification.error({
            message:
              error?.response?.message ?? "Something went wrong, please try again later."
          })

        setError(error)
        throw error.response
      } finally {
        setIsLoading(false)
      }
    },
    [url, method]
  )

  return { makeRequest, data, isLoading, error }
}
export default usePost

type MethodType = "post" | "put" | "delete" | "get"

type TToastType = Partial<{
  successToast: boolean
  errorToast: boolean
}>

import { useEffect, useState } from "react"
import api from "@api/index"
import qs from "qs"
import axios, { AxiosRequestConfig, CancelTokenSource } from "axios"
import { removeEmpty } from "@utils/index"

const IS_DEVELOP = import.meta.env.VITE_ENVIRONMENT === "develop"
const useFetch = <T>(url: string, payload?: PayloadType<T>) => {
  const {
    apiParams,
    callback = (res: any) => res,
    noFetch = false,
    onError = () => {}
  } = payload ?? {}
  const [data, setData] = useState<T>()
  const [loading, setLoading] = useState(false)
  const [isFirstLoad, setisFirstLoad] = useState(true)
  const [reload, setReload] = useState(true)

  const fetchData = async (source: CancelTokenSource) => {
    try {
      setLoading(true)
      let options = apiParams ? apiParams : { cancelToken: source.token }
      options = apiParams?.params
        ? {
            ...options,
            params: removeEmpty(apiParams.params),
            paramsSerializer: (p) => qs.stringify(p, { arrayFormat: "repeat" })
          }
        : options

      const res = await api(url, { ...options, cancelToken: source.token })

      setData(callback ? callback(res.data) : res.data)

      if (IS_DEVELOP) {
        setLoading(false)
        if (isFirstLoad) setisFirstLoad(false)
      }
    } catch (e: any) {
      if (!axios.isCancel(e.response)) {
        if (IS_DEVELOP) {
          setLoading(false)
          if (isFirstLoad) setisFirstLoad(false)
        }
        onError(e.response)
      }
    } finally {
      if (!IS_DEVELOP) {
        setLoading(false)
        if (isFirstLoad) setisFirstLoad(false)
      }
    }
  }

  const commondeps = [reload, noFetch]
  const deps = apiParams ? [JSON.stringify(apiParams), ...commondeps] : commondeps
  useEffect(() => {
    if (noFetch) return

    const source = axios.CancelToken.source()

    fetchData(source)

    return () => {
      source.cancel()
    }
  }, deps)

  return [
    data,
    { loading, refetch: () => setReload((s) => !s), setData, isFirstLoad }
  ] as const
}

export default useFetch
type PayloadType<T> = {
  apiParams?: AxiosRequestConfig
  callback?: (response: any) => T
  noFetch?: boolean
  onError?: (e: any) => void
}

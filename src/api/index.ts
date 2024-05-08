import axios from "axios"
import SessionExpireModal from "./SessionExpireModal"
const api = axios.create({ baseURL: import.meta.env.VITE_BASE_URL })

const publicUrls = ["authapi"]

api.interceptors.request.use((request) => {
  if (!publicUrls.some((url) => request.url?.includes(url))) {
    request.headers.Authorization = `Bearer ${localStorage.getItem("accessToken")}`
  }

  return request
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) SessionExpireModal()

    return Promise.reject({
      response: error.response?.data ? error.response.data : error.response ?? error
    })
  }
)
export default api

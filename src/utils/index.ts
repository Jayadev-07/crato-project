import useCompanyData from "@src/store/companyData"
import { notification } from "antd"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import { TSwalFire } from "./util.type"

export const MODAL_ERROR_CODE = 417

export const removeEmpty = (data: Record<string, any>) => {
  return Object.fromEntries(
    Object.entries(data).filter(([_, v]) => !(v == null || v.length == 0))
  )
}

export const isObjEmpty = (obj: Record<string, any>) => Object.keys(obj).length === 0

export const getCompanyId = () => useCompanyData.getState().companyId

export const getEmailId = () => useCompanyData.getState().email

export const decimalNumberFormatter = (num?: string | null | number) => {
  if (!num) return 0.0
  const data = `${num},`.replaceAll(",", "")
  const deciNum = parseFloat(data).toFixed(2)
  return Number(deciNum)
}

export const maskEmail = (email: string) => {
  const atIndex = email.indexOf("@")
  const username = email.substring(0, atIndex)
  const maskedUsername =
    username.charAt(0) + username.charAt(1) + "*".repeat(username.length - 1) // Mask all characters except the first one
  const domain = email.substring(atIndex)
  return maskedUsername + domain
}

export const passwordValidator = (_: unknown, value: string | undefined) => {
  const passwordRegEX = /^(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,16})/
  if (!value) return Promise.reject("Password cannot be blank.")
  if (value.length < 8 || value.length > 16) return Promise.reject("Invalid Password")
  if (!passwordRegEX.test(value)) return Promise.reject("Invalid Password")
  return Promise.resolve()
}

export const checkDownloadUrl = async (url: string, fileName = "file") => {
  try {
    const response = await fetch(url)
    if (response.ok) return window.open(url, fileName)
    notification.error({ message: "Invalid URL" })
  } catch (error) {
    notification.error({ message: "Invalid URL" })
  }
}

export const swalFire: TSwalFire = async (param, isWithReactContent = false) => {
  const defaultOption = {
    customClass: { confirmButton: "btn btn-primary" },
    buttonsStyling: false,
    allowOutsideClick: false,
    allowEscapeKey: false,
    allowEnterKey: false
  }

  if (!isWithReactContent) return await Swal.fire({ ...defaultOption, ...param })

  return await withReactContent(Swal).fire({
    ...defaultOption,
    ...param
  })
}

export const removeKey = <T = Record<string, string>>(obj: T, keyToRemove: keyof T) => {
  if (!obj || typeof obj !== "object") return {}
  if (!(keyToRemove in obj)) return { ...obj }
  const { [keyToRemove]: _, ...rest } = obj
  return rest
  console.log(_)
}

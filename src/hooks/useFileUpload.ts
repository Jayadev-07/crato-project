import { useState } from "react"
import axios from "axios"
import api from "@api/index"
import getUrl from "@api/url"
import usePost from "./usePost"
import { checkDownloadUrl, getCompanyId } from "@utils/index"
import type { RcFile, UploadFile } from "antd/es/upload/interface"

const useFileUpload = (key: KeyType) => {
  const [isUploading, setIsUploading] = useState(false)
  const companyId = getCompanyId()

  const { isLoading: isDownloading, makeRequest } = usePost<{ downloadURL: string }>(
    getUrl("CLOUD_SERVICES_API", "GET_DOWNLOD_URL"),
    "get"
  )

  const handleUpload = async (file: UploadFile<RcFile>, fileName: string) => {
    try {
      setIsUploading(true)
      const fileExtension = file.type?.split("/")[1]
      const { data } = await api.get(getUrl("CLOUD_SERVICES_API", "GET_UPLOAD_URL"), {
        params: { fileExtension, fileName, resourceType: key, companyId }
      })

      await axios.put(data.url, file, {
        headers: { "Content-Type": file.type, "File-Extension": fileExtension }
      })
    } catch (error) {
      throw { message: "Error in uploading file" }
    } finally {
      setIsUploading(false)
    }
  }

  const handleDownload = async (fileName: string, type: DownloadType = "DOWNLOAD") => {
    if (!fileName) return
    try {
      const name = fileName.split("_")?.[0] ?? "file"
      const { downloadURL } = await makeRequest({
        params: { fileName, resourceType: key, companyId }
      })
      if (type == "OPEN_NEW_WINDOW") return checkDownloadUrl(downloadURL, name)
      const response = await fetch(downloadURL)
      if (!response.ok) throw new Error()
      const blob = await response.blob()

      const a = document.createElement("a")
      a.href = window.URL.createObjectURL(blob)
      a.download = name

      a.click()
    } catch (error: any) {
      throw { data: { message: error?.data?.message ?? "Error in downloading file" } }
    }
  }

  return { handleUpload, handleDownload, isUploading, isDownloading }
}

export default useFileUpload

type DownloadType = "DOWNLOAD" | "OPEN_NEW_WINDOW"

type KeyType = "COMPANY"

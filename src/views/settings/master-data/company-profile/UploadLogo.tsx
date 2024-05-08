import { Button, Image, Modal, Popover, Upload, message, notification } from "antd"
import { useState } from "react"
import type { UploadFile, UploadProps } from "antd/es/upload/interface"
import avatar from "@assets/images/avatar-blank.png"
import { InboxOutlined } from "@ant-design/icons"
import "@scss/components/company-profile.scss"
import useFileUpload from "@hooks/useFileUpload"
import useFetch from "@hooks/useFetch"
import getUrl from "@api/url"
import { getCompanyId } from "@utils/index"
import useCompanyData from "@src/store/companyData"
import type { TDownloadUrl } from "@src/types/common.type"

const { Dragger } = Upload
const UploadLogo = (prop: TProp) => {
  const { imgUrl, onSubmit } = prop
  const [image] = useState(avatar)
  const [visible, setVisible] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [imgUploadLoading, setImgUploadLoading] = useState(false)

  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const updateCompanyProfile = useCompanyData((s) => s.updateCompanyProfile)
  const [data] = useFetch<TDownloadUrl>(getUrl("CLOUD_SERVICES_API", "GET_DOWNLOD_URL"), {
    apiParams: {
      params: { fileName: imgUrl, resourceType: "COMPANY", companyId: getCompanyId() }
    },
    noFetch: !imgUrl
  })
  const { handleUpload: handleImageUpload } = useFileUpload("COMPANY")

  const onCancel = () => {
    setIsModalOpen(false)
    setFileList([])
  }

  const props: UploadProps = {
    accept: "image/*",
    listType: "picture",
    onRemove: (file) => {
      const index = fileList.indexOf(file)
      const newFileList = fileList.slice()
      newFileList.splice(index, 1)
      setFileList(newFileList)
    },
    onDrop: (e) => {
      const file = e.dataTransfer.files[0] ?? {}
      const isImage = file.type.includes("image/")
      if (!isImage) message.error(`${file.name} is not a img file`)
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file])
      return false
    },
    fileList
  }

  const onUpload = async () => {
    try {
      const fileName = `${fileList[0]?.name.split(".")[0]}_${new Date().getTime()}`
      const fileExtension = fileList[0].type?.split("/")[1]
      if (!fileList.length) return
      setImgUploadLoading(true)
      const imageName = `${fileName}.${fileExtension}`
      await handleImageUpload(fileList[0], fileName)
      await onSubmit(imageName)
      updateCompanyProfile({ imgUrl: imageName })
    } catch (error: any) {
      notification.error({
        message: error?.message ?? "Company profile  updated failed. Please try later"
      })
      console.log(error)
    } finally {
      setImgUploadLoading(false)
      onCancel()
    }
  }

  return (
    <>
      <div className="d-flex mb-2">
        <Popover
          trigger={["click"]}
          arrow={false}
          overlayInnerStyle={{ marginLeft: "0.3rem", marginBottom: "2.2rem" }}
          open={isProfileOpen}
          placement="right"
          onOpenChange={(e) => setIsProfileOpen(e)}
          content={
            <div>
              <Button
                block
                disabled={!imgUrl}
                className="mb-2"
                onClick={() => {
                  setVisible(true)
                  setIsProfileOpen(false)
                }}
                id="view-logo"
              >
                View Logo
              </Button>
              <Button
                block
                type="primary"
                onClick={() => {
                  setIsModalOpen(true)
                  setIsProfileOpen(false)
                }}
                id="change-logo"
              >
                Change Logo
              </Button>
            </div>
          }
        >
          <div>
            <img
              className="rounded me-50 cursor-pointer"
              src={data?.url ?? image}
              alt="Logo"
              height="100"
              id="image-logo"
              width="100"
            />
            <p className="fw-bolder text-center" style={{ marginTop: "5px" }}>
              Logo
            </p>
          </div>
        </Popover>
      </div>

      <div>
        <Image
          style={{ display: "none" }}
          src={data?.url ?? image ?? ""}
          preview={{
            visible,
            src: data?.url ?? image ?? "",
            onVisibleChange: (value) => setVisible(value)
          }}
        />
      </div>

      <Modal
        maskClosable={false}
        centered
        title="Upload your Image"
        open={isModalOpen}
        onCancel={onCancel}
        confirmLoading={imgUploadLoading}
        onOk={onUpload}
        destroyOnClose
        data-testid="Modal"
        className="upload-modal"
        okText="Save image"
        okButtonProps={{ id: "save-image-btn" }}
        cancelButtonProps={{ id: "modal-cancel-btn" }}
      >
        <Dragger
          className={fileList.length >= 1 ? "hide-drag" : ""}
          {...props}
          id="upload-file"
        >
          {fileList.length >= 1 ? null : uploadButton}
        </Dragger>
      </Modal>
    </>
  )
}

export default UploadLogo

const uploadButton = (
  <>
    <p className="ant-upload-drag-icon">
      <InboxOutlined />
    </p>
    <p className="ant-upload-text">Click or drag file to this area to upload</p>
    <p className="ant-upload-hint">Upload your profile, Pic.</p>
  </>
)

type TProp = { imgUrl?: string; onSubmit: (fileName: string) => Promise<void> }

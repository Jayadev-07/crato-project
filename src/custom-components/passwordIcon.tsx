import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons"
import "@scss/components/password-icon.scss"

const passwordIcon = (visible: boolean) => {
  return visible ? (
    <span id="visible-eye">
      <EyeOutlined />
    </span>
  ) : (
    <span id="hidden-eye">
      <EyeInvisibleOutlined />
    </span>
  )
}

export default passwordIcon

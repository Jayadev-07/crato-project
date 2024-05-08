import { WarningOutlined } from "@ant-design/icons"
import { Input } from "antd"
import { InputRef, PasswordProps } from "antd/es/input"
import passwordIcon from "./passwordIcon"
import { KeyboardEvent } from "react"

const InputPassword = (props?: TProps) => {
  const { capsLockHandler = () => {}, capsLockMsg, isCapsOn, ...rest } = props ?? {}
  return (
    <Input.Password
      onKeyDown={capsLockHandler}
      onPaste={(e) => e.preventDefault()}
      onCopy={(e) => e.preventDefault()}
      status={isCapsOn ? "warning" : ""}
      prefix={isCapsOn ? <WarningOutlined /> : <></>}
      iconRender={passwordIcon}
      {...rest}
    />
  )
}

export default InputPassword

type TProps = PasswordProps & React.RefAttributes<InputRef> & TCapsLock

type TCapsLock = {
  isCapsOn: boolean
  capsLockHandler: (e: KeyboardEvent<HTMLInputElement>) => void
  capsLockMsg: JSX.Element
}

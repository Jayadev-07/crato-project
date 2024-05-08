import { KeyboardEvent, useState } from "react"

const useCapsLock = () => {
  const [isCapsOn, setIsCapsOn] = useState(false)

  const capsLockHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    const checkCaps = e.getModifierState("CapsLock")
    if (isCapsOn != checkCaps) setIsCapsOn(checkCaps)
  }

  const capsLockMsg = isCapsOn ? (
    <span id="caps-lock-msg" className="text-warning ms-50">
      (Caps Lock is on)
    </span>
  ) : (
    <></>
  )

  return { isCapsOn, capsLockHandler, capsLockMsg }
}

export default useCapsLock

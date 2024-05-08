import { decrypt, encrypt } from "@utils/encryptDecryptService"
import { StateStorage } from "zustand/middleware"

const storage: StateStorage = {
  getItem: (name) => {
    const str = localStorage.getItem(name)
    if (!str) return null
    return decrypt(str)
  },
  setItem: (name, value) => {
    const encryptedValue = encrypt(value)
    localStorage.setItem(name, encryptedValue)
  },
  removeItem: (name) => localStorage.removeItem(name)
}

export default storage

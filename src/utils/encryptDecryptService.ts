import CryptoJS from "crypto-js"

const SECRET_KEY: string = import.meta.env.VITE_CLIENT_SECRET

const encrypt = (text: string, withEncode: boolean = false) => {
  const txt = CryptoJS.AES.encrypt(JSON.stringify(text), SECRET_KEY).toString()
  const encodedTxt = withEncode ? encodeURIComponent(txt) : txt
  return encodedTxt
}

const decrypt = (encryptedText: string) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedText, SECRET_KEY)
    const dectText = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
    return dectText
  } catch (error) {
    return null
  }
}

export { encrypt, decrypt }

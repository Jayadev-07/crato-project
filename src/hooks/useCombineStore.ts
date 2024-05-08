import useCompanyData from "@src/store/companyData"
import { resetFilterStore } from "@src/store/filter/filterStore"
import useLayoutStore from "@src/store/layout"
import { tokenSignal } from "@views/login/index"

const onLogout = () => {
  useLayoutStore.getState().reset()
  useCompanyData.getState().reset()
  resetFilterStore()
  tokenSignal.value = null
  localStorage.clear()
}
const onSwitchCompany = () => {
  localStorage.removeItem("companyInfo")
  useCompanyData.getState().removeCompanyDetails()
  resetFilterStore()
}
const useCombineStore = () => {
  return { onLogout, onSwitchCompany }
}

export default useCombineStore

useCombineStore.getState = () => ({
  onLogout,
  onSwitchCompany
})

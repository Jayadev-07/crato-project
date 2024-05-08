import getUrl from "@api/url"
import SplashScreen from "@custom-components/SplashScreen"
import useFetch from "@hooks/useFetch"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "@scss/components/company-landing.scss"
import useCompanyData from "@src/store/companyData"

const CompanyLoading = () => {
  const [clients = null as any] = useFetch(
    getUrl("MASTER_DATA_API", "TENANT_USER", "USER_DETAILS")
  )
  const updateCompanyProfile = useCompanyData((s) => s.updateCompanyProfile)

  const navigate = useNavigate()
  useEffect(() => {
    if (!clients) return
    if (clients?.companyList) {
      updateCompanyProfile({
        ...clients?.companyInfo,
        companyCount: clients?.companyList?.length
      })
      navigate("/company")
    }
    if (clients?.companyInfo) {
      updateCompanyProfile({
        ...clients?.companyInfo,
        companyCount: 1
      })
      navigate("/dashboard")
    }
  }, [clients?.companyInfo, clients?.companyList])

  return <SplashScreen />
}

export default CompanyLoading

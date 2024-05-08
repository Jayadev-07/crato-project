import getUrl from "@api/url"
import useFetch from "@hooks/useFetch"
import useCompanyData from "@src/store/companyData"
import { TDownloadUrl } from "@src/types/common.type"
import { getCompanyId } from "@utils/index"

const CompanySwitch = () => {
  const clientName = useCompanyData((s) => s.displayName)
  const imgUrl = useCompanyData((s) => s.imgUrl)

  const [data] = useFetch<TDownloadUrl>(getUrl("CLOUD_SERVICES_API", "GET_DOWNLOD_URL"), {
    apiParams: {
      params: { fileName: imgUrl, resourceType: "COMPANY", companyId: getCompanyId() }
    },
    noFetch: !imgUrl
  })

  return (
    <>
      {data?.url && (
        <img
          src={data.url}
          style={{ maxWidth: "30px", maxHeight: "30px" }}
          className="company-switch-image"
        />
      )}

      <div className="mx-1 d-none d-md-inline-block">
        <h4 className="m-0 font-weight-bolder">{clientName}</h4>
      </div>
    </>
  )
}

export default CompanySwitch

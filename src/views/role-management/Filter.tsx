import getUrl from "@api/url"
import FilterWrapper from "@custom-components/FilterWrapper"
import PopupFilter from "@custom-components/popup-filter"
import useFetch from "@hooks/useFetch"
import useFilter from "@hooks/useFilter"
import type { TOptions } from "@src/types/common.type"
import { getCompanyId } from "@utils/index"
import { useEffect } from "react"

const Filter = () => {
  const { filter, setFilter } = useFilter("ROLE_LIST")

  const [companyList] = useFetch<TOptions>(
    getUrl("MASTER_DATA_API", "COMPANY_PROFILE", "GET_ALL_COMPANIES")
  )
  useEffect(() => {
    if (filter.companyIds?.[0]) return
    setFilter({ companyIds: [companyList?.[0]?.value!] })
  }, [companyList?.length])
  return (
    <FilterWrapper page="ROLE_LIST">
      <PopupFilter
        type="single"
        name="Company"
        value={filter.companyIds?.[0]}
        options={companyList}
        onChange={(e) => setFilter({ companyIds: [e ?? getCompanyId()] })}
      />
    </FilterWrapper>
  )
}

export default Filter

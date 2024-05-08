import { shallow } from "zustand/shallow"
import { createWithEqualityFn } from "zustand/traditional"
import storeCreationWrapper from "./helper/storeCreationWrapper"

const initialValue = {} as TCompanyProfile
const useCompanyData = createWithEqualityFn<TCompanyProfile & TCompanyProfileAction>()(
  storeCreationWrapper(
    (set) => ({
      ...initialValue,
      updateCompanyProfile: (d) =>
        set((state) => ({ ...state, ...d }), false, "updateCompanyProfile"),
      reset: () =>
        set(
          ({ reset, updateCompanyProfile }) => ({ updateCompanyProfile, reset }),
          true,
          "reset"
        ),
      removeCompanyDetails: () =>
        set(
          ({ companyCount, email, name, updateCompanyProfile, reset }) => ({
            companyCount,
            email,
            name,
            updateCompanyProfile,
            reset
          }),
          true,
          "removeCompanyDetails"
        )
    }),
    {
      devtools: { name: "companyData", store: "useCompanyData" },
      loggerName: "companyData",
      persistName: "companyInfo"
    }
  ),
  shallow
)

export default useCompanyData

type TCompanyProfile = {
  displayName: string
  defaultCurrency: string
  transactionalCurrencies: string[]
  timeZoneId: string
  dateFormat: string
  imgUrl: null | string
  companyId: string
  companyMode: "TEST" | null
  name: string
  companyCount: number
  email: string
}

type TCompanyProfileAction = {
  updateCompanyProfile: (payload: Partial<TCompanyProfile>) => any
  reset: () => any
  removeCompanyDetails: () => any
}

export type TCompanyProfile = Partial<{
  companyId: string
  updateInfo: TUpdateInfo
  legalName: string
  displayName: string
  companyType: string
  industryType: string
  businessAddress: TBusinessAddress
  defaultCurrency: string
  isMultiCurrency: boolean
  transactionalCurrencies: string[]
  timeZoneId: string
  dateFormat: string
  imgUrl: string
  taxId: string
}>

type TUpdateInfo = {
  updatedBy: string
  updatedOn: string
  createdBy: string
  createdOn: string
}

type TBusinessAddress = {
  addressLine1: string
  addressLine2: any
  city: string
  state: string
  zipCode: string
  country: string
  phoneNumber: string
  fax: any
}

import { TPaginationFilter } from "@src/types/common.type"

export type TCORP_STRUCTURE = TPaginationFilter & {}

export type TGL_ACCOUNT = TPaginationFilter & {}

export type TUSER_MANAGEMENT = TPaginationFilter & {
  status?: string[]
}

export type TROLE_LIST = TPaginationFilter & {
  baseRoleName?: string[]
  roleName?: string[]
  isPageable: boolean
  status: null | boolean
}
export type TUSER_CORP_FILTER = {
  deltaId?: string
  list: TData[]
}
type TData = TPaginationFilter & {
  segmentId?: string
  companyId: string
}

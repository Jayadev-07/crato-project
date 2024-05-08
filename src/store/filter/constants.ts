import { getCompanyId } from "@utils/index"
import {
  TCORP_STRUCTURE,
  TGL_ACCOUNT,
  TUSER_MANAGEMENT,
  TROLE_LIST,
  TUSER_CORP_FILTER
} from "./constants.type"

const CORP_STRUTURE: TCORP_STRUCTURE = {
  // companyIds: [getCompanyId() ?? ""],
  page: 1,
  count: 25
}

const GL_ACCOUNT: TGL_ACCOUNT = {
  // companyIds: [getCompanyId() ?? ""],
  page: 1,
  count: 50
}
const USER_MANAGEMENT: TUSER_MANAGEMENT = {
  companyIds: [getCompanyId()],
  page: 1,
  count: 50
}

const USER_CORP_FILTER: TUSER_CORP_FILTER = {
  // segmentId: "businessunit",
  list: []
}
export const ROLE_LIST: TROLE_LIST = {
  page: 1,
  count: 25,
  isPageable: true,
  status: null,
  companyIds: [getCompanyId()]
}

export const INITIAL_VALUES = {
  ACTIVE_FILTERS: ["hfoeqqqqqqq"],
  GL_ACCOUNT,
  CORP_STRUTURE,
  USER_MANAGEMENT,
  USER_CORP_FILTER,
  ROLE_LIST
}

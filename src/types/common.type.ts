import { PageType } from "@hooks/useFilter"
import type { ColumnGroupType, ColumnType } from "antd/es/table"

export type TOptions = {
  label: string
  value: string
}[]

export type TPaginationType<T> = {
  list: T[]
  totalCount: number
}

export type TPaginationFilter = {
  companyIds?: string[]
  page: number
  count: number
  searchTerm?: string
  sortOrder?: "ASC" | "DESC"
  sortField?: string
}

export type TPaginationComponents = Exclude<PageType, "USER_CORP_FILTER">
export type TableColumnType<T = any> = (ColumnType<T> | ColumnGroupType<T>)[]

export type TDownloadUrl = { url: string }

export type TenantDataType = Partial<{
  tenantAccessObject: TenantAccessObject[]
  productType: string
  tenantConfig: Record<string, any>
}>

type TenantAccessObject = {
  module: string
  subModules: SubModule[]
}

type SubModule = {
  name: string
  active: boolean
}

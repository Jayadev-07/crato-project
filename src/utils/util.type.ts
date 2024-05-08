import { TooltipProps } from "antd"
import { ReactNode } from "react"
import { SweetAlertOptions, SweetAlertResult } from "sweetalert2"

export type TTooltipWrapper = TooltipProps & {
  children: ReactNode
  isTooltipNeed?: boolean
  toolTipValue: ReactNode
}

export type TSwalFire = (
  param: SweetAlertOptions,
  withReactContent?: boolean
) => Promise<SweetAlertResult<any>>

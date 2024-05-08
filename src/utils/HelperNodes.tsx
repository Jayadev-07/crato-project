import { ReactNode } from "react"
import { Tooltip, TooltipProps } from "antd"
type ToolTipWrapperType = {
  children: ReactNode
  isTooltipNeed?: boolean
  toolTipValue: string
} & TooltipProps
export const ToolTipWrapper = ({
  children,
  isTooltipNeed = true,
  toolTipValue,
  ...props
}: ToolTipWrapperType) => {
  if (!isTooltipNeed) return children
  return (
    <Tooltip color="#6c757d" className="cursor-pointer" title={toolTipValue} {...props}>
      {children}
    </Tooltip>
  )
}

/* Get formated values for tables with tooltip */
export const formatedValue = (value: number, data: ReactNode) => {
  if (!data) return "-"
  const formatData = String(data)
  if (formatData.length <= value) return data
  return (
    <ToolTipWrapper toolTipValue={formatData} overlayStyle={{ maxWidth: "30rem" }}>
      <span>{`${formatData.slice(0, value)}..`}</span>
    </ToolTipWrapper>
  )
}

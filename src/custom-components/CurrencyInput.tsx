import currencyFormater from "@utils/currencyFormatter"
import { InputNumber, InputNumberProps } from "antd"

const CurrencyInput = (props: TProps) => {
  return (
    <InputNumber
      formatter={(value) => currencyFormater(value, false)}
      addonAfter={"USD"}
      controls={false}
      {...props}
    />
  )
}

export default CurrencyInput

type TProps = InputNumberProps

import { Card } from "antd"
import TickMark from "./TickMark"
import "@scss/components/password-criteria.scss"

const errorList = [
  { label: "8 to 16 characters" },
  { label: "Atleast 1 uppercase character", value: /[A-Z]/ },
  { label: "Atleast 1 lowercase character", value: /[a-z]/ },
  { label: "Atleast 1 numerical character", value: /[0-9]/ },
  { label: "Atleast 1 special character", value: /[@#$%^&+=]/ }
]
interface PropType {
  value: string
}
const PasswordValidator = ({ value: formValues }: PropType) => {
  return (
    <Card id="password-criteria" size="small" title="Password must contain :">
      {errorList.map(({ value, label }, id) => (
        <li key={id} id={`password-validator-${id}`} className="my-50">
          <div className="d-flex  justify-content-between" id={`password-${id}`}>
            <span data-testid="label" className="me-8">
              {label}&nbsp;&nbsp;
            </span>
            <TickMark active={isSatisfy(value, formValues)} />
          </div>
        </li>
      ))}
    </Card>
  )
}
export default PasswordValidator

export const isSatisfy = (value: RegExp | undefined, formValue = "") => {
  if (value) return value.test(formValue)
  return formValue.length >= 8 && formValue.length <= 16
}

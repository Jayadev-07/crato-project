import { decimalNumberFormatter } from "."

const currencyFormater = (number?: number | string, needFractions = true) => {
  const currency = decimalNumberFormatter(number)
  const locales = "en-US"
  const options = needFractions
    ? {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }
    : undefined
  return new Intl.NumberFormat(locales, options).format(currency)
}

export default currencyFormater

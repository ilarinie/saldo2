import currency from 'currency.js'
import { CurrencyFormatOptions, CurrencyFormatOptionsWithPlus } from './CurrencyFormatOptions'

export const formatCurrency = (amount: any, withPlus = false) => {

  return currency(amount).format(withPlus ? CurrencyFormatOptionsWithPlus : CurrencyFormatOptions)

}

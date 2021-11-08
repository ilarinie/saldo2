export const CurrencyFormatOptions = {
  symbol: '€',
  pattern: '#!',
  negativePattern: '- #!',
}

export const CurrencyFormatOptionsWithPlus = {
  ...CurrencyFormatOptions,
  pattern: '+ #!',
}

import { useEffect, useState } from 'react'

export const usePurchaseValidation = (amount: any, description: any) => {
  const [validation, setValidation] = useState({
    description: {
      isTouched: false,
      isValid: true,
      error: '',
    },
    amount: {
      isTouched: false,
      isValid: true,
      error: '',
    },
  })
  const [isInvalidInputs, setIsInvalidInputs] = useState(false)

  useEffect(() => {
    doValidate()
  }, [amount, description])

  const allValuesEmpty = () => {
    return (!description || description === '') && (!amount || amount === '')
  }

  const doValidate = () => {
    if (allValuesEmpty()) {
      return resetValidation()
    }
    const isValidAmount = amount !== '' && amount !== undefined
    const isValidDescription = description !== '' && description !== undefined && typeof description === 'string'
    setValidation({
      description: {
        isTouched: true,
        isValid: isValidDescription,
        error: isValidDescription ? '' : 'Description is invalid',
      },
      amount: {
        isTouched: true,
        isValid: isValidAmount,
        error: isValidAmount ? '' : 'Amount is invalid',
      },
    })
    setIsInvalidInputs(!isValidAmount || !isValidDescription)
  }

  const resetValidation = () => {
    setIsInvalidInputs(false)
    setValidation({
      description: {
        isTouched: false,
        isValid: true,
        error: '',
      },
      amount: {
        isTouched: false,
        isValid: true,
        error: '',
      },
    })
  }

  return { validationResult: validation, isInvalidInputs, resetValidation }
}

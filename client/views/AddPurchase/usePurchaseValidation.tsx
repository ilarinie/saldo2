import { useEffect, useRef, useState } from 'react'

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
  const didMountRef = useRef(false)

  useEffect(() => {
    if (didMountRef.current) return doValidate()
    else didMountRef.current = true
  }, [amount, description])

  const doValidate = () => {
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

  return { validationResult: validation, isInvalidInputs }
}

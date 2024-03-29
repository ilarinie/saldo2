import { useEffect, useState } from 'react'

export function useDebouncedValue(value: any, wait: number) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const id = setTimeout(() => setDebouncedValue(value), wait)
    return () => clearTimeout(id)
  }, [value, wait])

  return debouncedValue
}

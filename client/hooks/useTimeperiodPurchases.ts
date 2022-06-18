import { startOfMonth, startOfToday } from 'date-fns'
import { useEffect, useState } from 'react'
import { Purchase } from 'types'

export const enum Timeperiod {
  TODAY,
  THIS_MONTH,
}

type TimeperiodPurchaseData = {
  timeperiodPurchases: Purchase[]
  total: number
  counts: {
    [userId: string]: number
  }
}

export const useTimeperiodPurchases = (purchases: Purchase[], timeperiod: Timeperiod) => {
  const [timePeriodPurchaseData, setTimeperiodPurchaseData] = useState({
    timeperiodPurchases: [],
    total: 0,
    counts: {},
  } as TimeperiodPurchaseData)

  useEffect(() => {
    const filteredPurchases = filterPurchases()
    setTimeperiodPurchaseData({
      timeperiodPurchases: filteredPurchases.sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
      total: countTotals(filteredPurchases).total,
      counts: {},
    })
  }, [purchases])

  const filterPurchases = () => {
    let timestamp = new Date().toISOString()
    switch (timeperiod) {
      case Timeperiod.TODAY:
        timestamp = startOfToday().toISOString()
        break
      case Timeperiod.THIS_MONTH:
        timestamp = startOfMonth(new Date()).toISOString()
        break
    }
    const magicIndex = purchases.slice().findIndex(purchase => purchase.createdAt < timestamp)
    return purchases.slice(0, magicIndex)
  }

  const countTotals = (filteredPurchases: Purchase[]) => {
    console.log(filteredPurchases)
    const data = {
      counts: {},
      total: 0,
    }
    filteredPurchases.forEach(p => {
      data.total = data.total + p.amount
    })
    return data
  }

  return timePeriodPurchaseData
}

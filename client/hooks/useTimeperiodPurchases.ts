import { startOfMonth, startOfToday } from 'date-fns'
import { useMemo } from 'react'
import { Purchase } from 'types'

export const enum Timeperiod {
  TODAY,
  THIS_MONTH,
}

export const useTimeperiodPurchases = (purchases: Purchase[], timeperiod: Timeperiod, updateFunction?: any) => {
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
    const magicIndex = [...purchases].slice().findIndex(purchase => purchase.createdAt < timestamp)
    return [...purchases].slice(0, magicIndex)
  }

  const countTotals = (filteredPurchases: Purchase[]) => {
    const data: {
      total: number
      userDiffs: {
        [userId: string]: number
      }
    } = {
      total: 0,
      userDiffs: {},
    }
    filteredPurchases.forEach(p => {
      data.total = data.total + p.amount
      p.benefactors.forEach(b => {
        if (!data.userDiffs[b.user._id]) {
          data.userDiffs[b.user._id] = 0
        }
        data.userDiffs[b.user._id] = data.userDiffs[b.user._id] - b.amountBenefitted
        data.userDiffs[b.user._id] = data.userDiffs[b.user._id] + b.amountPaid
      })
    })
    return data
  }

  const timePeriodPurchaseData = useMemo(() => {
    const filteredPurchases = filterPurchases()
    const { total, userDiffs } = countTotals([...filteredPurchases])
    if (updateFunction) {
      updateFunction(userDiffs)
    }
    return {
      timeperiodPurchases: [...filteredPurchases].sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
      total: total,
      counts: userDiffs,
    }
  }, [purchases.length])

  return timePeriodPurchaseData
}

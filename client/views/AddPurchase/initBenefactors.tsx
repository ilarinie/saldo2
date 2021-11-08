import currency from 'currency.js'
import { PurchaseUser } from 'types'

export type InitBenefactorParams = {
  amount?: number | ''
  payerId?: string
  defaultMode?: 'even-split' | 'saldo'
  userMap?: { [key: string]: PurchaseUser }
  memberIds?: string[]
}

export const initBenefactors = ({
  amount = 0,
  payerId = '',
  defaultMode = 'saldo',
  userMap = {},
  memberIds = [],
}: InitBenefactorParams): any[] => {
  if (defaultMode === 'saldo') {
    const membersAmount = currency(amount).distribute(memberIds.length - 1)
    return memberIds.map((m, index) => {
      return {
        user: userMap[m],
        amountPaid: payerId === m ? amount : 0,
        amountBenefitted: payerId !== m ? membersAmount.splice(Math.floor(Math.random() * membersAmount.length), 1)[0]?.value || 0 : 0,
      }
    })
  } else {
    const evenDivided = currency(amount).distribute(memberIds.length)
    return memberIds.map((m, index) => {
      return {
        user: userMap[m],
        amountPaid: payerId === m ? amount : 0,
        amountBenefitted: evenDivided.splice(Math.floor(Math.random() * evenDivided.length), 1)[0].value,
      }
    })
  }
}

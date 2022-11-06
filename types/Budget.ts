export type Budget = {
  _id: string
  name: string
  ownerIds: string[]
  memberIds: string[]
  allIds: string[]
  userMap: { [userId: string]: import('.').PurchaseUser }
  purchases: import('.').Purchase[]
  total: number
  type: 'budget' | 'saldo'
  totals: import('.').UserTotal[]
  newTotal?: number
}

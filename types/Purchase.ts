export type Purchase = {
  _id: string
  budgetId: string
  description: string
  createdBy: import('.').PurchaseUser
  amount: number
  benefactors: import('.').Benefactor[]
  createdAt: string
  updatedAt: string
  type: string
}

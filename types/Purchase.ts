export type Purchase = {
  _id: string
  budgetId: string
  description: string
  createdBy: import('.').PurchaseUser
  amount: number
  benefactors: import('.').Benefactor[]
  updatedAt: string
  type: string
  purchaseId: string
} & import('./HasCreationDate').HasCreationDate

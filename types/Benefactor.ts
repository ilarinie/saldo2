export type Benefactor = BenefactorBase & { user: import('.').PurchaseUser }

export type BenefactorCreateParams = BenefactorBase & { user: string }

type BenefactorBase = {
  amountPaid: number
  amountBenefitted: number
}
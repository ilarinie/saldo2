export interface BudgetResponse {
  _id: string;
  name: string;
  owners: PurchaseUser[];
  members: PurchaseUser[];
  purchases: Purchase[];
  total: number;
  type: 'budget' | 'saldo';
  totals: {
    user: PurchaseUser;
    totalPaid: number;
    totalBenefitted: number;
    diff: number;
  }[];
}

export interface Purchase {
  description: string;
  createdBy: PurchaseUser;
  amount: number;
  benefactors: Benefactor[];
  createdAt: string;
  updatedAt: string;
}

export interface Benefactor {
  amountPaid: number;
  amountBenefitted: number;
  user: PurchaseUser;
}

export type PurchaseUser = {
  _id: string;
  name: string;
  picture: string;
};

export interface BudgetResponse {
  _id: string;
  name: string;
  owners: PurchaseUser[];
  members: PurchaseUser[];
  purchases: Purchase[];
  total: number;
  totals: {
    user: PurchaseUser;
    saldo: number;
  }[];
}

export interface Purchase {
  description: string;
  createdBy: PurchaseUser;
  payer: PurchaseUser;
  createdAt: string;
  updatedAt: string;
}

export type PurchaseUser = {
  name: string;
  picture: string;
};

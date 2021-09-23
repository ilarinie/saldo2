export interface Budget {
  _id: string;
  name: string;
  ownerIds: string[];
  memberIds: string[];
  allIds: string[];
  userMap: { [userId: string]: User };
  purchases: Purchase[];
  total: number;
  type: 'saldo' | 'budget';
  totals: UserTotal[];
}

export interface UserTotal {
  user: User;
  totalPaid: number;
  totalBenefitted: number;
  diff: number;
}

export interface Purchase {
  _id: string;
  budgetId: string;
  description: string;
  createdBy: User;
  amount: number;
  benefactors: Benefactor[];
  createdAt: string;
  updatedAt: string;
}

export type Benefactor = {
  user: User;
  amountPaid: number;
  amountBenefitted: number;
};

export type User = {
  _id: string;
  name: string;
  picture: string;
};

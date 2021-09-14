export interface Budget {
  _id: string;
  name: string;
  owners: User[];
  members: User[];
  purchases: Purchase[];
  total: number;
  totals: {
    user: User;
    saldo: number;
  }[];
}

export interface Purchase {
  description: string;
  createdBy: User;
  payer: User;
  createdAt: string;
  updatedAt: string;
}

export type User = {
  _id: string;
  name: string;
  picture: string;
};

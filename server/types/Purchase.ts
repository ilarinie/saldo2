import { Benefactor } from './Benefactor';
import { PurchaseUser } from './PurchaseUser';

export interface Purchase {
  _id: string;
  budgetId: string;
  description: string;
  createdBy: PurchaseUser;
  amount: number;
  benefactors: Benefactor[];
  createdAt: string;
  updatedAt: string;
}

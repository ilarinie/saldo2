import { PurchaseUser } from './PurchaseUser';

export interface Benefactor {
  amountPaid: number;
  amountBenefitted: number;
  user: PurchaseUser;
}

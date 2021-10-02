import { PurchaseUser } from './PurchaseUser';

export interface UserTotal {
  user: PurchaseUser;
  totalPaid: number;
  totalBenefitted: number;
  diff: number;
}

import { Purchase } from './Purchase';
import { PurchaseUser } from './PurchaseUser';
import { UserTotal } from './UserTotal';

export interface BudgetResponse {
  _id: string;
  name: string;
  ownerIds: string[];
  memberIds: string[];
  allIds: string[];
  userMap: { [userId: string]: PurchaseUser };
  purchases: Purchase[];
  total: number;
  type: 'budget' | 'saldo';
  totals: UserTotal[];
}

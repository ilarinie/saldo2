import { Purchase } from './Purchase';
import { User } from './User';

export interface Budget {
  _id: string;
  name: string;
  members: User[];
  owners: User[];
  purchases: Purchase[];
}

import { createContext } from 'react';
import { BudgetStore } from './BudgetStore';
import { RootState } from './RootState';

export const rootState = new RootState(new BudgetStore());

export const RootContext = createContext<RootState>(rootState);

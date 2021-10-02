import axios from 'axios';
import { makeAutoObservable, runInAction } from 'mobx';
import { BudgetResponse } from 'server/types/BudgetResponse';

export class BudgetStore {
  ids: string[] = [];
  map: { [key: string]: BudgetResponse } = {};

  constructor() {
    makeAutoObservable(this);
    this.setupVisibilityChangeListener();

    this.fetchBudgets();
  }

  private setupVisibilityChangeListener = () => {
    document.addEventListener('visibilitychange', () => {
      !document.hidden && this.fetchBudgets();
    });
  };

  fetchBudgets = async () => {
    try {
      const res = await axios.get('/api/budgets');

      let newBudgetIds: string[] = [];
      let newBudgetMap: { [key: string]: BudgetResponse } = {};
      console.log(res.data.resp);

      res.data.resp.forEach((re: BudgetResponse) => {
        newBudgetIds.push(re._id);
        newBudgetMap[re._id] = re;
      });

      runInAction(() => {
        this.ids = newBudgetIds;
        this.map = newBudgetMap;
      });
    } catch (err) {
      console.log(err);
    }
  };

  refreshBudget = async (budgetId: string) => {
    const res = await axios.get<any>('/api/budgets/' + budgetId);
    runInAction(() => {
      this.ids = [...this.ids];
      this.map = {
        ...this.map,
        [res.data.resp._id]: res.data.resp,
      };
    });
  };

  addBudget = async ({ name, type }: AddBudgetParams) => {
    try {
      await axios.post('/api/budgets', { name, type });
      this.fetchBudgets();
    } catch (err) {
      console.log(err);
    }
  };
}

interface AddBudgetParams {
  name: string;
  type: 'budget' | 'saldo';
}

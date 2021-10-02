import axios from 'axios';
import { makeAutoObservable, runInAction } from 'mobx';
import { Benefactor, BudgetResponse, Purchase } from 'server/types';
import { BudgetStore } from './BudgetStore';

type LoginState = 'PENDING' | 'UNAUTHORIZED' | 'LOGGED_IN';

export interface PurchaseCreationProps {
  amount: number;
  benefactors: Benefactor[];
  type: 'transfer' | 'purchase';
  description: string;
  budgetId: string;
}

export class RootState {
  purchases: Purchase[] = [];
  selectedBudget: BudgetResponse | undefined;

  loginState: LoginState = 'PENDING';
  loginError: string | undefined;
  ws: WebSocket | undefined;
  purchaseCreationError: string | undefined;

  currentUser: any | undefined;
  snackBarOpen: boolean = false;

  snackBarMessage: { severity: string; message: string } = {
    severity: 'info',
    message: 'test',
  };

  budgetStore: BudgetStore;
  constructor(budgetStore: BudgetStore) {
    makeAutoObservable(this);
    this.budgetStore = budgetStore;

    this.tryLogin();

    this.setupWebsocket();
  }

  showSnackbarMessage = (message: string, severity: string) => {
    runInAction(() => {
      this.snackBarOpen = true;
      this.snackBarMessage = {
        message,
        severity,
      };
    });
  };

  closeSnackbar = () => {
    this.snackBarOpen = false;
  };

  private tryLogin = async () => {
    try {
      const { data } = await axios.post('/api/checklogin');
      runInAction(() => {
        this.loginState = 'LOGGED_IN';
        this.loginError = '';
        this.currentUser = data;
      });
    } catch (err: any) {
      runInAction(() => {
        this.loginState = 'UNAUTHORIZED';
        this.loginError = err.message;
        this.currentUser = undefined;
      });
    }
  };

  private setupWebsocket = () => {
    const newWebsocket = new WebSocket(
      (import.meta.env.VITE_WEBSOCKET_URI || 'ws://localhost:3001/ws') as string
    );
    const bound = this.setupWebsocket;

    newWebsocket.onopen = () => {
      console.log('connected');
    };

    newWebsocket.onmessage = (event) => {
      const purchase = JSON.parse(event.data);
      this.budgetStore.refreshBudget(purchase.budgetId);
      this.showSnackbarMessage('Saldoa lisätty', 'info');
    };

    newWebsocket.onerror = function (err) {
      console.error(
        'Socket encountered error: ',
        //@ts-ignore
        err.message,
        'Closing socket'
      );
      newWebsocket.close();
      setTimeout(bound, 5000);
    };

    this.ws = newWebsocket;
  };

  private setupPolling = () => {
    setTimeout(this.setupPolling, 10000);
  };

  createPurchase = async ({
    amount,
    description,
    budgetId,
    benefactors,
  }: PurchaseCreationProps) => {
    if (amount && description) {
      try {
        await axios.post<Purchase>('/api/purchases', {
          amount,
          description,
          budgetId,
          benefactors: benefactors.map((b) => ({
            ...b,
            user: b.user._id,
          })),
        });
        this.budgetStore.refreshBudget(budgetId);
      } catch (err: any) {
        this.purchaseCreationError = err.message;
      }
    } else {
      this.purchaseCreationError = 'Summa tai selite puuttuu';
    }
  };

  deletePurchase = async (purchaseId: string, budgetId: string) => {
    try {
      await axios.delete('/api/purchases/' + purchaseId);
      this.budgetStore.refreshBudget(budgetId);
      this.showSnackbarMessage('Purchase deleted', 'info');
    } catch (err) {
      console.error('err', err);
    }
  };

  addUser = async (budget: BudgetResponse, newUserName: string) => {
    try {
      await axios.post(`/api/budgets/${budget._id}/addnewusers`, {
        budgetId: budget._id,
        username: newUserName,
      });
      this.budgetStore.refreshBudget(budget._id);
      this.showSnackbarMessage('User added', 'info');
    } catch (err) {
      console.error('err', err);
    }
  };
}

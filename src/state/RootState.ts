import axios from 'axios';
import { makeAutoObservable, runInAction } from 'mobx';
import { ReactNode } from 'react';
import { Benefactor, Budget, Purchase } from 'src/models/Budget';

type FetchingState = 'PENDING' | 'ERROR' | 'FETCHED';
type LoginState = 'PENDING' | 'UNAUTHORIZED' | 'LOGGED_IN';

export class RootState {
  purchases: Purchase[] = [];
  budgets: Budget[] = [];
  selectedBudget: Budget | undefined;
  totalSaldo: number = 0;
  changeToday: number = 0;
  state: FetchingState = 'PENDING';
  loginState: LoginState = 'PENDING';
  loginError: string | undefined;
  ws: WebSocket | undefined;
  purchaseCreationError: string | undefined;
  modalContents: null | ReactNode = null;
  currentUser: any | undefined;
  budgetIds: string[] = [];
  budgetMap: { [key: string]: Budget } = {};
  snackBarOpen: boolean = false;
  snackBarMessage: { severity: string; message: string } = {
    severity: 'info',
    message: 'test',
  };

  constructor() {
    makeAutoObservable(this);

    this.tryLogin();

    this.setupVisibilityChangeListener();
    this.fetchBudgets();

    // this.setupPolling();
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
      process.env.REACT_APP_WEBSOCKET_URI || 'ws://localhost:3001/ws'
    );
    const bound = this.setupWebsocket;

    newWebsocket.onopen = () => {
      console.log('connected');
    };

    newWebsocket.onmessage = (event) => {
      const purchase = JSON.parse(event.data);

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

  private setupVisibilityChangeListener = () => {
    document.addEventListener('visibilitychange', () => {
      !document.hidden && this.fetchBudgets();
    });
  };

  private setupPolling = () => {
    this.fetchBudgets();
    setTimeout(this.setupPolling, 10000);
  };

  fetchBudgets = async () => {
    this.budgets = [];
    try {
      const res = await axios.get('/api/budgets');
      this.budgets = res.data.resp;
      let newBudgetIds: string[] = [];
      let newBudgetMap: { [key: string]: Budget } = {};
      console.log(res.data.resp);

      res.data.resp.forEach((re: Budget) => {
        newBudgetIds.push(re._id);
        newBudgetMap[re._id] = re;
      });

      runInAction(() => {
        this.budgetIds = newBudgetIds;
        this.budgetMap = newBudgetMap;
      });
    } catch (err) {
      console.log('erro');
      console.log(err);
      this.state = 'ERROR';
    }
  };

  createPurchase = async (
    amount: number,
    description: string,
    budgetId: string,
    payerId: string,
    benefactors: Benefactor[]
  ) => {
    if (amount && description) {
      try {
        await axios.post<Purchase>('/api/purchases', {
          amount,
          description,
          budgetId,
          payerId,
          benefactors: benefactors.map((b) => ({
            ...b,
            user: b.user._id,
          })),
        });
        this.refreshBudget(budgetId);
      } catch (err: any) {
        this.purchaseCreationError = err.message;
      }
    } else {
      this.purchaseCreationError = 'Summa tai selite puuttuu';
    }
  };

  refreshBudget = async (budgetId: string) => {
    const res = await axios.get<any>('/api/budgets/' + budgetId);
    runInAction(() => {
      this.budgetIds = [...this.budgetIds];
      this.budgetMap = {
        ...this.budgetMap,
        [res.data.resp._id]: res.data.resp,
      };
    });
  };

  deletePurchase = async (purchaseId: string, budgetId: string) => {
    try {
      await axios.delete('/api/purchases/' + purchaseId);
      this.refreshBudget(budgetId);
      this.showSnackbarMessage('Purchase deleted', 'info');
    } catch (err) {
      console.error('err', err);
    }
  };

  logIn = async (secret: string) => {
    try {
      axios.defaults.headers.common = {
        Authorization: secret || '',
      };
      await axios.post('/api/checklogin');
      localStorage.setItem('token', secret);
      runInAction(() => {
        this.loginError = '';
        this.loginState = 'LOGGED_IN';
      });
    } catch (err) {
      runInAction(() => {
        this.loginState = 'UNAUTHORIZED';
        this.loginError = 'Wrong secret, try again.';
      });
    }
  };
}

import axios from 'axios';
import { isSameDay } from 'date-fns';
import { makeAutoObservable, runInAction } from 'mobx';
import { ReactNode } from 'react';
import addNotification from 'react-push-notification';
import { Purchase, PurchaseWithCumTotal } from '../models/Purchase';
import { PurchaseCreationDialog } from '../views/NewDashboard/PurchaseCreationDialog/PurchaseCreationDialog';

type FetchingState = 'PENDING' | 'ERROR' | 'FETCHED';
type LoginState = 'PENDING' | 'UNAUTHORIZED' | 'LOGGED_IN';

export type DateToPurchaseMap = { [date: string]: PurchaseWithCumTotal[] };

export class RootState {
  purchases: Purchase[] = [];
  totalSaldo: number = 0;
  changeToday: number = 0;
  purchasesWithCumulativeTotal: PurchaseWithCumTotal[] = [];
  state: FetchingState = 'PENDING';
  loginState: LoginState = 'PENDING';
  dateToPurchaseMap: DateToPurchaseMap = {};
  loginError: string | undefined;
  ws: WebSocket | undefined;
  purchaseCreationError: string | undefined;
  modalContents: null | ReactNode = null;

  constructor() {
    makeAutoObservable(this);

    axios.defaults.headers.common = {
      Authorization: localStorage.getItem('token') || '',
    };

    this.tryLogin();

    this.setupVisibilityChangeListener();
    this.fetchPurchases();

    // this.setupPolling();
    this.setupWebsocket();
  }

  private tryLogin = async () => {
    try {
      await axios.post('/api/checklogin');
      runInAction(() => {
        this.loginState = 'LOGGED_IN';
        this.loginError = '';
      });
    } catch (err) {
      runInAction(() => {
        this.loginState = 'UNAUTHORIZED';
        this.loginError = err.message;
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
      const newestPurchase = this.purchases[this.purchases.length - 1];
      if (!newestPurchase || newestPurchase._id != purchase.purchase._id) {
        this.setPurchasesAndCalculateTotal([
          purchase.purchase,
          ...this.purchases,
        ]);
      }
      addNotification({
        title: 'Saldoa lisätty',
        subtitle: purchase.purchase.amount.toFixed(2) + '€',
        message: purchase.purchase.description,
        native: false,
      });
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
      !document.hidden && this.fetchPurchases();
    });
  };

  private setupPolling = () => {
    this.fetchPurchases();
    setTimeout(this.setupPolling, 10000);
  };

  private setPurchasesAndCalculateTotal = (purchases: Purchase[]) => {
    runInAction(() => {
      this.loginState = 'LOGGED_IN';
      this.purchases = purchases;
      let cumTotal = 0;
      let newChangeToday = 0;
      this.purchasesWithCumulativeTotal = [...purchases]
        .reverse()
        .map((p, index) => {
          if (isSameDay(new Date(p.createdAt), new Date())) { 
            newChangeToday += p.amount;
          }
          cumTotal += p.amount;
          return {
            cumTotal,
            ...p,
          };
        })
        .reverse();
      this.changeToday = newChangeToday;

      
      const newDateToPurchaseMap: DateToPurchaseMap = {};

      this.purchasesWithCumulativeTotal.forEach((p) => {
        if (
          newDateToPurchaseMap[
            new Date(p.createdAt || '').toLocaleDateString('fi-FI')
          ]
        ) {
          newDateToPurchaseMap[
            new Date(p.createdAt || '').toLocaleDateString('fi-FI')
          ].push(p);
        } else {
          newDateToPurchaseMap[
            new Date(p.createdAt || '').toLocaleDateString('fi-FI')
          ] = [p];
        }
      });

      this.dateToPurchaseMap = newDateToPurchaseMap;
      this.totalSaldo = parseFloat(cumTotal.toFixed(2));
    });
  };

  fetchPurchases = async () => {
    this.purchases = [];
    this.state = 'PENDING';
    try {
      const res = await axios.get('/api/purchases');
      this.setPurchasesAndCalculateTotal(res.data.reverse());
    } catch (err) {
      console.log({ err });
      runInAction(() => {
        this.loginState = 'UNAUTHORIZED';
        this.state = 'ERROR';
      });
    }
  };
  createPurchase = async (amount: number, description: string) => {
    if (amount && description) {
      try {
        const res = await axios.post<Purchase>('/api/purchases', {
          amount,
          description,
        });
        // this.setPurchasesAndCalculateTotal([res.data, ...this.purchases]);
      } catch (err) {
        this.purchaseCreationError = err.message;
      }
    } else {
      this.purchaseCreationError = 'Summa tai selite puuttuu';
    }
  };

  deletePurchase = async (purchaseId: string) => {
    try {
      await axios.delete('/api/purchases/' + purchaseId);
      this.setPurchasesAndCalculateTotal(
        this.purchases.filter((p) => p._id !== purchaseId)
      );
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

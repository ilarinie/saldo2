import axios from "axios";
import { makeAutoObservable, runInAction } from "mobx";
import addNotification from "react-push-notification";
import { Purchase, PurchaseWithCumTotal } from "./models/Purchase";

type FetchingState = 'PENDING' | 'ERROR' | 'FETCHED';
type LoginState = 'PENDING' | 'UNAUTHORIZED' | 'LOGGED_IN';

const ws = new WebSocket(process.env.REACT_APP_WEBSOCKET_URI || 'ws://localhost:3001/ws');

export type DateToPurchaseMap = { [date: string]: PurchaseWithCumTotal[] };

export class RootState {

    purchases: Purchase[] = [];
    totalSaldo: number = 0;
    purchasesWithCumTotal: PurchaseWithCumTotal[] = [];
    state: FetchingState = 'PENDING';
    loginState: LoginState = 'PENDING';
    dateToPurchaseMap: DateToPurchaseMap = {}


    constructor() {
        makeAutoObservable(this);
        ws.onopen = () => {
            console.log('connected');
        }
        
        ws.onmessage = evt => {
            const purchase = JSON.parse(evt.data);
            this.setPurchasesAndCalculateTotal([purchase.purchase, ...this.purchases])
            addNotification({
                title: 'Saldoa lisätty',
                subtitle: purchase.purchase.amount.toFixed(2) + '€',
                message: purchase.purchase.description,
                // theme: 'darkblue',
                native: false,
                // duration: 10000
            
            });
        }
      
        ws.onerror = err => {
            console.error(
                "Socket encountered error: ",
                //@ts-ignore
                err.message,
                "Closing socket"
            );
            ws.close();
        };

        document.addEventListener("visibilitychange", () => {
            !document.hidden && this.fetchPurchases();
        });
    }

    setPurchasesAndCalculateTotal = (purchases: Purchase[]) => {
        runInAction(() => {
            this.loginState = 'LOGGED_IN';
            this.purchases = purchases;
            let cumTotal = 0;
            this.purchasesWithCumTotal = [ ...purchases].reverse().map((p, index)=> {
                cumTotal += p.amount;
                return {
                    cumTotal,
                    ...p
                }
            }).reverse();

            const newDateToPurchaseMap: DateToPurchaseMap = {}

            this.purchasesWithCumTotal.forEach(p => {
                if (newDateToPurchaseMap[new Date(p.createdAt || '').toLocaleDateString('fi-FI')]) {
                    newDateToPurchaseMap[new Date(p.createdAt || '').toLocaleDateString('fi-FI')].push(p);
                } else {
                    newDateToPurchaseMap[new Date(p.createdAt || '').toLocaleDateString('fi-FI')] = [p]
                }
            })

            this.dateToPurchaseMap = newDateToPurchaseMap;
            console.log('setting shit', this.purchasesWithCumTotal)
            this.totalSaldo = parseFloat(cumTotal.toFixed(2))

        })
    }

    async fetchPurchases() {
        this.purchases = [];
        this.state = 'PENDING';
        try {
            const res = await axios.get('/api/purchases');
            this.setPurchasesAndCalculateTotal(res.data.reverse());
            
        } catch (err) {
            console.log({err});
            runInAction(() => {
                this.loginState = 'UNAUTHORIZED';
                this.state = 'ERROR';
            })
        }

    }

    async deletePurchase(purchaseId: string) {
        // eslint-disable-next-line no-restricted-globals
        const asd = confirm('Oootko varma että haluut poistaa');
        if (asd) {
          const res = await axios.delete('/api/purchases/' + purchaseId);
          this.setPurchasesAndCalculateTotal(this.purchases.filter(p => p._id !== purchaseId))
        }
    }

}



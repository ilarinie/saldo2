export interface Purchase {
    _id?: string;
    amount: number;
    description: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface PurchaseWithCumTotal extends Purchase {
    cumTotal: number;
}
export declare enum TradeStatus {
    CREATED = "CREATED",
    PAID = "PAID",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
    APPEAL = "APPEAL"
}
export declare class Trade {
    orderId: string;
    orderNo: string;
    amount: number;
    price: number;
    currency: string;
    token: string;
    buyerName: string;
    buyerRealName: string;
    status: TradeStatus;
    paymentMethod: string;
    createdAt: Date;
    updatedAt: Date;
    isPaymentVerified: boolean;
}

export declare class Payment {
    id: string;
    reference: string;
    amount: number;
    currency: string;
    payerName: string;
    payerEmail: string;
    status: string;
    metadata: any;
    matchedTradeId: string;
    receivedAt: Date;
}

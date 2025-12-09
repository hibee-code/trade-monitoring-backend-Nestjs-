import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum TradeStatus {
    CREATED = 'CREATED',
    PAID = 'PAID',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
    APPEAL = 'APPEAL',
}

@Entity()
export class Trade {
    @PrimaryColumn() // Bybit Order ID
    orderId: string;

    @Column()
    orderNo: string;

    @Column({ type: 'decimal', precision: 18, scale: 8 })
    amount: number; // Crypto amount

    @Column({ type: 'decimal', precision: 18, scale: 2 })
    price: number; // Fiat amount

    @Column()
    currency: string; // Fiat currency (e.g., NGN)

    @Column()
    token: string; // Crypto token (e.g., USDT)

    @Column()
    buyerName: string;

    @Column({ nullable: true })
    buyerRealName: string;

    @Column({ type: 'enum', enum: TradeStatus, default: TradeStatus.CREATED })
    status: TradeStatus;

    @Column({ nullable: true })
    paymentMethod: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({ type: 'boolean', default: false })
    isPaymentVerified: boolean;
}

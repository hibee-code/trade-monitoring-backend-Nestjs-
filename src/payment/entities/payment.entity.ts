import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Payment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    reference: string;

    @Column({ type: 'decimal', precision: 18, scale: 2 })
    amount: number;

    @Column()
    currency: string;

    @Column()
    payerName: string;

    @Column({ nullable: true })
    payerEmail: string;

    @Column()
    status: string; // success, failed

    @Column({ type: 'jsonb', nullable: true })
    metadata: any;

    @Column({ nullable: true })
    matchedTradeId: string; // Internal relation to matched trade

    @CreateDateColumn()
    receivedAt: Date;
}

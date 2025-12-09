import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class AuditLog {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    action: string;

    @Column({ nullable: true })
    entityId: string; // ID of the entity involved (Trade ID, Payment ID)

    @Column({ nullable: true })
    entityType: string; // 'TRADE', 'PAYMENT'

    @Column({ type: 'jsonb', nullable: true })
    details: any;

    @CreateDateColumn()
    timestamp: Date;
}

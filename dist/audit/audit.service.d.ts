import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';
export declare class AuditService {
    private auditRepository;
    constructor(auditRepository: Repository<AuditLog>);
    log(action: string, entityType: string, entityId: string, details?: any): Promise<AuditLog>;
}

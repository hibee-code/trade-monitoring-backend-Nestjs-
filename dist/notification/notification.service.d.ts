import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export declare class NotificationService implements OnModuleInit {
    private configService;
    private readonly logger;
    private bot;
    private chatId;
    constructor(configService: ConfigService);
    onModuleInit(): void;
    sendAlert(message: string): Promise<void>;
}

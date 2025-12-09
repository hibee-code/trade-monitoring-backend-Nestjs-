import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as TelegramBot from 'node-telegram-bot-api';

@Injectable()
export class NotificationService implements OnModuleInit {
    private readonly logger = new Logger(NotificationService.name);
    private bot: TelegramBot;
    private chatId: string;

    constructor(private configService: ConfigService) { }

    onModuleInit() {
        const token = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
        this.chatId = this.configService.get<string>('TELEGRAM_CHAT_ID') || '';

        if (token) {
            this.bot = new TelegramBot(token, { polling: false }); // We use webhook or just push messages, no polling needed for now
            this.logger.log('Telegram Bot initialized');
        } else {
            this.logger.warn('TELEGRAM_BOT_TOKEN not found, notifications disabled');
        }
    }

    async sendAlert(message: string) {
        if (!this.bot || !this.chatId) {
            this.logger.warn('Cannot send alert, bot not configured: ' + message);
            return;
        }

        try {
            await this.bot.sendMessage(this.chatId, message);
            this.logger.log('Alert sent to Telegram');
        } catch (error) {
            this.logger.error('Failed to send Telegram alert', error);
        }
    }
}

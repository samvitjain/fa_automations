import { Injectable } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class TelegramService {
  private bot: TelegramBot;

  constructor() {
    console.log('TELEGRAM_BOT_TOKEN:', process.env.TELEGRAM_BOT_TOKEN);
    this.bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
      polling: true,
    });
    this.bot.on('message', (msg) => {
      console.log(`Chat ID: ${msg.chat.id}\nMessage: ${msg.text}`);
    });
  }

  async sendMessage(chatId: string, message: string) {
    try {
      await this.bot.sendMessage(chatId, message);
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }
}

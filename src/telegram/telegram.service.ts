import { Injectable } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const TelegramBot = require('node-telegram-bot-api');

@Injectable()
export class TelegramService {
  private bot: typeof TelegramBot;

  TELEGRAM_BOT_TOKEN = '6186575821:AAGI8hnMOzN1g04pzKmaBrVS_O3kPcDjpMY';

  constructor() {
    console.log('TELEGRAM_BOT_TOKEN:', this.TELEGRAM_BOT_TOKEN);
    this.bot = new TelegramBot(this.TELEGRAM_BOT_TOKEN, {
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

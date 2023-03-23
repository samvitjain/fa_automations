import { Controller, Get } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import * as readline from 'readline';

@Controller('telegram')
export class TelegramController {
  constructor(private readonly telegramService: TelegramService) {}

  @Get('send-message')
  async sendMessage(): Promise<string> {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question('Enter chat ID: ', async (chatId) => {
      rl.question('Enter message: ', async (message) => {
        const result = await this.telegramService.sendMessage(chatId, message);
        console.log(result);
        rl.close();
      });
    });

    return 'Message sent';
  }
}

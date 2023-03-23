import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TelegramModule } from './telegram/telegram.module';
import { AsanaModule } from './asana/asana.module';

@Module({
  imports: [TelegramModule, AsanaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

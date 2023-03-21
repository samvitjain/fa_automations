import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GoogleSheetModule } from './google-sheet/google-sheet.module';

@Module({
  imports: [GoogleSheetModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

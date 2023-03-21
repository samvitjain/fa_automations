import { Module } from '@nestjs/common';
import { GoogleSheetController } from './google-sheet.controller';
import { GoogleSheetService } from './google-sheet.service';

@Module({
  controllers: [GoogleSheetController],
  providers: [GoogleSheetService],
})
export class GoogleSheetModule {}

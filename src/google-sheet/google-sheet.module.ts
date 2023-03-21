import { HttpModule } from '@nestjs/axios/dist/http.module';
import { Module } from '@nestjs/common';
import { GoogleSheetController } from './google-sheet.controller';
import { GoogleSheetService } from './google-sheet.service';

@Module({
  imports: [HttpModule],
  controllers: [GoogleSheetController],
  providers: [GoogleSheetService],
})
export class GoogleSheetModule {}

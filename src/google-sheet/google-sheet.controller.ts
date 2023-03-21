import { Controller, Get } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Controller('api/v1/google-sheet')
export class GoogleSheetController {
  constructor(private httpService: HttpService) {}
  @Get('/fetch-data')
  async getSheetData(): Promise<any> {
    const sheetUrl =
      'https://docs.google.com/spreadsheets/d/1dv75i9VLnIJXCybO3b92qCWB8BgaS0wNAlSz6W-ZzkU/export?format=csv';
    const response = await this.httpService.get(sheetUrl).toPromise();
    const csvData = response.data;
    console.log(csvData); // or use a logger instance
    return { message: 'Data logged!' };
  }
}

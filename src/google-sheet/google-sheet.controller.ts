import { Controller, Get } from '@nestjs/common';
import * as csv from 'csv';
import axios from 'axios';

@Controller('api/v1/google-sheet')
export class GoogleSheetController {
  @Get('/fetch-data')
  async getSheetData(): Promise<any> {
    const sheetUrl =
      'https://docs.google.com/spreadsheets/d/e/2PACX-1vSEWF0NOf_uf877sVdrOhnXJbyOE5iMz-5v3p2jbB4rJa5O6aV4fR8WmFKHjQeDg4TO5TbPDr8gYtdv/pub?gid=0&single=true&output=csv';
    const response = await axios.get(sheetUrl);
    const results = [];
    csv.parse(response.data, (err: any, data: any) => {
      if (err) throw err;
      results.push(...data);
    });
    console.log(response.data);
  }
}

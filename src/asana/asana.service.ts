import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AsanaService {
  private readonly ASANA_ACCESS_TOKEN =
    '1/1190264422161000:12ed156cf7166ab978ec91cd40f0ce53';
  private readonly ASANA_API_BASE_URL = 'https://app.asana.com/api/1.0';

  async createTask(projectId: string, taskName: string): Promise<any> {
    const headers = {
      Authorization: `Bearer ${this.ASANA_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    };

    const data = {
      data: {
        name: taskName,
        projects: [projectId],
      },
    };

    const response = await axios.post(
      `${this.ASANA_API_BASE_URL}/tasks`,
      data,
      { headers },
    );
    return response.data;
  }
}

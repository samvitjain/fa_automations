import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as dotenv from 'dotenv';
dotenv.config();
@Injectable()
export class AsanaService {
  private readonly ASANA_API_BASE_URL = 'https://app.asana.com/api/1.0';

  async createTask(projectId: string, taskName: string): Promise<any> {
    const headers = {
      Authorization: `Bearer ${process.env.ASANA_ACCESS_TOKEN}`,
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

  async getTasks(projectId: string): Promise<any> {
    const headers = {
      Authorization: `Bearer ${process.env.ASANA_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    };

    const response = await axios.get(
      `${this.ASANA_API_BASE_URL}/tasks?project=${projectId}`,
      { headers },
    );
    return response.data;
  }
}

const asanaService = new AsanaService();
const projectId = '1204172907154852';
const projectId2 = '1204103455728246';
const taskName = 'Create Asana Controller';
asanaService
  .createTask(projectId, taskName)
  .then((result) => {
    console.log(result);
    return asanaService.getTasks(projectId2);
  })
  .then((tasks) => console.log(tasks))
  .catch((error) => console.error(error));

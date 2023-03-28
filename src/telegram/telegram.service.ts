import { Injectable } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';
import * as Asana from 'asana';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FAUser } from 'src/entities/fa-user.entity';
import { AsanaProject } from 'src/entities/asana-project.entity';
const https = require('https');
@Injectable()
export class TelegramService {
  private bot: TelegramBot;

  constructor(
    @InjectRepository(FAUser)
    private usersRepository: Repository<FAUser>,
    @InjectRepository(AsanaProject)
    private projectRrepository: Repository<AsanaProject>,
  ) {
    console.log('TELEGRAM_BOT_TOKEN:', process.env.TELEGRAM_BOT_TOKEN);
    this.bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
      polling: true,
    });
    this.bot.on('message', (msg) => {
      console.log(`Chat ID: ${msg.chat.id}\nMessage: ${msg.text}`);
    });
    const client = Asana.Client.create().useAccessToken(
      process.env.ASANA_ACCESS_TOKEN,
    );

    function getAssigneeId(mention) {
      mention = mention ? mention.toLowerCase() : '';
      const assigneeMap = new Map([
        ['riya', '1202546049582950'],
        ['samvit', 'samvit@flick2know.com'],
        ['param', '34377429456964'],
        ['animesh', '1202904304336852'],
        ['aditya', '1201392479885593'],
        ['chitransh', '415063412948698'],
        ['sayantani', '1201373923823953'],
        ['varun', 'varun@flick2know.com'],
      ]);

      for (const userName of assigneeMap.keys()) {
        if (userName.includes(mention)) {
          return assigneeMap.get(userName);
        }
      }
      return '0';
    }

    function createNewProject(projectName) {
      const options = {
        hostname: 'app.asana.com',
        path: '/api/1.0/projects',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.ASANA_ACCESS_TOKEN}`,
        },
      };

      const data = {
        data: {
          team: '1204103455728242',
          name: projectName,
          workspace: '34125054317482',
        },
      };

      const req = https.request(options, (res) => {
        console.log(`statusCode: ${res.statusCode}`);

        res.on('data', (d) => {
          process.stdout.write(d);
        });
      });

      req.on('error', (error) => {
        console.error(error);
      });

      req.write(JSON.stringify(data));
      req.end();
    }

    this.bot.on('message', (msg) => {
      const messegeTexts = msg.text.split(' ');
      if (messegeTexts[0] == '@fa_task_bot') {
        const command = messegeTexts[1];
        const chatId = msg.chat.id;
        const assigneeId = getAssigneeId(messegeTexts[2]); // Send the assignee name
        console.log(assigneeId);
        if (true) {
          // TODO(Riya): add condition to check if there is a project corresponding to this chatId
          const projectName = messegeTexts.slice(2).join(' ').trim();
          createNewProject(projectName);
        }
        switch (command) {
          case 'cr':
          case 'create':
            if (assigneeId == '0') {
              this.bot.sendMessage(chatId, `${messegeTexts[2]} user not found`);
            } else {
              const taskName = messegeTexts.slice(3).join(' ').trim();

              client.tasks
                .create({
                  name: taskName,
                  assignee: assigneeId,
                  workspace: '34125054317482',
                  projects: ['1204172907154852'], // TODO (Riya): Make the project dynamic
                  followers: ['varun@flick2know.com'], // TODO (Riya): Make task creator as the follower
                  due_on: '2023-03-27',
                })
                .then((task) => {
                  this.bot.sendMessage(
                    chatId,
                    `Task created with title: ${task.name}  for: ${task.assignee.name}`,
                  );
                })
                .catch((error) => {
                  console.error(error);
                  this.bot.sendMessage(
                    chatId,
                    'An error occurred while creating the task on Asana.',
                  );
                });
            }

            break;
          case 'ls':
          case 'list':
            const https = require('https');

            const accessToken =
              '1/1190264422161000:12ed156cf7166ab978ec91cd40f0ce53';
            // assigneeId = assignee;
            const workspaceId = '34125054317482';
            const projectId = '1204172907154852';

            const options = {
              hostname: 'app.asana.com',
              path: `/api/1.0/projects/${projectId}/tasks`,
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            };

            https
              .get(options, (response) => {
                let data = '';

                response.on('data', (chunk) => {
                  data += chunk;
                });

                response.on('end', () => {
                  console.log(data); // log the entire response
                  const tasks = JSON.parse(data).data;
                  if (tasks.length > 0) {
                    tasks.forEach((task) => {
                      return this.bot.sendMessage(chatId, task.name);
                    });
                  } else {
                    this.bot.sendMessage(chatId, 'No tasks in the project');
                  }
                });
              })
              .on('error', (error) => {
                console.error(error);
              });

            break;
          default:
            this.bot.sendMessage(
              chatId,
              'Available commands are:\ncreate\t cr\nlist \tls',
            );
        }
      } else {
        // Privacy mode
        console.log('Bot not mentioned');
      }
    });

    this.bot.on('polling_error', (error) => {
      console.log(`Polling error: ${error}`);
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

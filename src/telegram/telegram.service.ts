import { Injectable } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';
import * as Asana from 'asana';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FAUser } from 'src/entities/fa-user.entity';
import { getAssigneeId } from 'src/telegram/telegram.utils';
import { AsanaProject } from 'src/entities/asana-project.entity';
const https = require('https');
@Injectable()
export class TelegramService {
  private bot: TelegramBot;
  private asanaProject: AsanaProject;

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
    const client = Asana.Client.create({
      defaultHeaders: {
        'Asana-Enable': 'new_goal_memberships',
      },
    }).useAccessToken(process.env.ASANA_ACCESS_TOKEN);

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
        // console.log(`statusCode: ${res.statusCode}`);

        res.on('data', (d) => {
          const responseData = JSON.parse(d.toString());
          return responseData.data.gid;
        });
      });

      req.on('error', (error) => {
        console.error(error);
      });

      req.write(JSON.stringify(data));

      req.end();
    }

    this.bot.on('message', async (msg) => {
      if (msg && msg.text) {
        const messegeTexts = msg.text.split(' ');
        if (messegeTexts[0] == '@fa_task_bot') {
          // console.log(msg);
          const command = messegeTexts[1];
          const chatId = msg.chat.id;
          const creator = getAssigneeId(msg.from.first_name.toLowerCase());
          const assigneeId = getAssigneeId(messegeTexts[2]); // Send the assignee name
          const taskName = messegeTexts.slice(3).join(' ').trim();

          switch (command) {
            case 'cr':
            case 'create':
              if (assigneeId == '0') {
                this.bot.sendMessage(
                  chatId,
                  `${messegeTexts[2]} user not found`,
                );
              } else {
                const taskName = messegeTexts.slice(3).join(' ').trim();
                this.asanaProject = new AsanaProject();
                this.asanaProject = await this.projectRrepository.findOne({
                  where: { telegramChatId: chatId.toString() },
                });

                if (!this.asanaProject) {
                  client.tasks
                    .create({
                      name: taskName,
                      assignee: assigneeId,
                      workspace: '34125054317482',
                      projects: [this.asanaProject.asanaId],
                      followers: [creator],
                      due_on: '2023-03-29',
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
                  // console.log(
                  //   `Task created in existing project ${this.asanaProject.name}: ${taskName}`,
                  // );
                } else {
                  const projectName = msg.chat.title;
                  this.asanaProject = new AsanaProject();
                  let asanaId = await createNewProject(projectName);
                  this.asanaProject.telegramChatId = chatId.toString();
                  this.asanaProject.name = projectName;
                  this.asanaProject.asanaId = asanaId;
                  // await this.projectRrepository.save(this.asanaProject);

                  // console.log('projectName' + ' ' + projectName);

                  // client.tasks
                  //   .create({
                  //     name: taskName,
                  //     assignee: assigneeId,
                  //     workspace: '34125054317482',
                  //     projects: [this.asanaProject.asanaId],
                  //     followers: [creator],
                  //     due_on: '2023-03-29',
                  //   })
                  //   .then((task) => {
                  //     this.bot.sendMessage(
                  //       chatId,
                  //       `Task created with title: ${task.name}  for: ${task.assignee.name}`,
                  //     );
                  //   })
                  //   .catch((error) => {
                  //     console.error(error);
                  //     this.bot.sendMessage(
                  //       chatId,
                  //       'An error occurred while creating the task on Asana.',
                  //     );
                  //   });
                  // console.log(
                  //   `Task created in new project ${projectName}: ${taskName}`,
                  // );
                }
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
                    // console.log(data); // log the entire response
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

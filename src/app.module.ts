import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TelegramModule } from './telegram/telegram.module';
import { AsanaModule } from './asana/asana.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FAUser } from './entities/fa-user.entity';
import { AsanaProject } from './entities/asana-project.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'fa-automations-debug.cgdpzbzq8oyv.us-east-1.rds.amazonaws.com',
      port: 5432,
      username: 'postgres',
      password: 'Sam#466987435',
      database: 'postgres',
      entities: [FAUser, AsanaProject],
      autoLoadEntities: true,
      synchronize: true,
    }),
    TelegramModule,
    AsanaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

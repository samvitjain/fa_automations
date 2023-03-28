import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AsanaProject } from 'src/entities/asana-project.entity';
import { FAUser } from 'src/entities/fa-user.entity';
import { TelegramController } from './telegram.controller';
import { TelegramService } from './telegram.service';

@Module({
  imports: [TypeOrmModule.forFeature([FAUser, AsanaProject])],
  controllers: [TelegramController],
  providers: [TelegramService],
  exports: [TypeOrmModule],
})
export class TelegramModule {}

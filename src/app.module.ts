import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TelegramModule } from './telegram/telegram.module';
import { AsanaModule } from './asana/asana.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [    
    TypeOrmModule.forRoot({
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: 5432,
    username: 'postgres',
    password: process.env.POSTGRES_PASSWORD,
    database: 'postgres',
    entities: [],
    autoLoadEntities: true,
    synchronize: true,
  }),TelegramModule, AsanaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

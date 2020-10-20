import { Module } from '@nestjs/common';

import { JournalService } from '../services/journal.service';
import { AppController } from '../controllers/app.controller';
import { LogModule } from './log.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Journal } from '../static/entity/journal.entity';
const orm = require('../../config/orm.json');

@Module({
  imports: [
    LogModule,
    TypeOrmModule.forFeature([Journal]),
  ], // 引入实体类
  providers: [JournalService],
  controllers: [AppController], // 控制器
  exports: [ JournalService ],
})
export class mainModule {}
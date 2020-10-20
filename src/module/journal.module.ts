import { Module } from '@nestjs/common';

import { JournalService } from '../services/journal.service';
import { JournalController } from '../controllers/journal.controller';
import { LogModule } from './log.module';
import { mainModule } from './main.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Journal } from '../static/entity/journal.entity';
const orm = require('../../config/orm.json');

@Module({
  imports: [
    LogModule,
    mainModule,
  ], // 引入实体类
  providers: [JournalService],
  controllers: [JournalController], // 控制器
  exports: [ JournalService ],
})
export class JournalModule {}
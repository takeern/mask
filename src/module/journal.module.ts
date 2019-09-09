import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JournalService } from '../services/journal.service';
import { SystemController } from '../controllers/system.controller';
import { Journal } from '../static/entity/journal.entity';

// module
import { LogModule } from './log.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Journal]),
        LogModule,
    ], // 引入实体类
    providers: [JournalService], // 为服务提供注册商
    controllers: [SystemController], // 控制器
})
export class JournalModule { }
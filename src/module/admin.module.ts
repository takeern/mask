import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from '../services/user.service';
import { AdminController } from '../controllers/admin.controller';
import { User } from '../static/entity/user.entity';

// module
import { LogModule } from './log.module';
import { JournalModule } from './journal.module';
import { UserModule } from './user.module';

@Module({
    imports: [
        LogModule,
        JournalModule,
        UserModule,
    ], // 引入实体类
    providers: [UserService],
    controllers: [AdminController], // 控制器
})
export class AdminModule { }
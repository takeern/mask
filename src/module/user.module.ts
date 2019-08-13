import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from '../services/user.service';
import { UserController } from '../controllers/user.controller';
import { User } from '../static/entity/user.entity';

// module
import { LogModule } from './log.module';
import { AuthModule } from './auth.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        LogModule,
        AuthModule,
    ], // 引入实体类
    providers: [UserService], // 为服务提供注册商
    controllers: [UserController], // 控制器
})
export class UserModule { }
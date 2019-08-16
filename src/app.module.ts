import { Module, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { UserController } from './controllers/user.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
const orm = require('../config/orm.json');

//middleware 
import { FiterDataMiddleware } from './middleware/fiterSpiderData.middleware';
import { CountMiddleware } from './middleware/count.middleware';


// modules
import { LogModule } from './module/log.module';
import { UserModule } from './module/user.module';

import { User } from './static/entity/user.entity'

@Module({
    imports: [
        LogModule,
        UserModule,
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: 'localhost',
            port: 3306,
            username: 'root',
            password: 'maskTakeern',
            database: 'mask', // 自己提前建好数据库, 无需建表
            entities: [User], // 实体存放的目录, 目前只能靠文件后缀识别
            synchronize: true, // 项目一运行就根据实体自动创建表结构
        }),
    ],
    controllers: [AppController],
})
export class ApplicationModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(CountMiddleware, FiterDataMiddleware).forRoutes(AppController, UserController);
    }
}

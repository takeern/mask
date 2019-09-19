import { Module, MiddlewareConsumer } from '@nestjs/common';

import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
const orm = require('../config/orm.json');

//middleware 
import { AccessMiddleware } from './middleware/fiterSpiderData.middleware';
import { CountMiddleware } from './middleware/count.middleware';

// controller
import { AppController } from './controllers/app.controller';
import { UserController } from './controllers/user.controller';
import { SystemController } from './controllers/system.controller';

// modules
import { LogModule } from './module/log.module';
import { UserModule } from './module/user.module';
import { JournalModule } from './module/journal.module';

import { User } from './static/entity/user.entity';
import { Journal } from './static/entity/journal.entity';

@Module({
    imports: [
        LogModule,
        UserModule,
        JournalModule,
        TypeOrmModule.forRoot({
            ...orm,
            entities: [User, Journal], // 实体存放的目录, 目前只能靠文件后缀识别
        }),
    ],
    controllers: [AppController],
})
export class ApplicationModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(CountMiddleware, AccessMiddleware)
            .forRoutes(AppController, UserController, SystemController);
    }
}

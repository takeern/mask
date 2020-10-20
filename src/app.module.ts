import { Module, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
// import { AppService } from './app.service';
import { JournalService } from '../src/services/journal.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Journal } from './static/entity/journal.entity';
const orm = require('../config/orm.json');

//middleware 
import { FiterDataMiddleware } from './middleware/fiterSpiderData.middleware';
import { CountMiddleware } from './middleware/count.middleware';


// modules
import { LogModule } from './module/log.module';
import { mainModule } from './module/main.module';
import { JournalModule } from './module/journal.module';
import { from } from 'rxjs';


@Module({
    imports: [
        LogModule,
        mainModule,
        JournalModule,
        TypeOrmModule.forRoot({
            ...orm,
            entities: [Journal], // 实体存放的目录, 目前只能靠文件后缀识别
        }),
    ],
    // controllers: [AppController],
    // providers: [JournalService],
})
export class ApplicationModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(CountMiddleware, FiterDataMiddleware).forRoutes(AppController);
    }
}

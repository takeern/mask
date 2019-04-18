import { Module, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { AppService } from './app.service';

//middleware 
import { FiterDataMiddleware } from './middleware/fiterSpiderData.middleware';
import { CountMiddleware } from './middleware/count.middleware';


// modules
import { LogModule } from './module/log.module';

@Module({
    imports: [LogModule],
    controllers: [AppController],
    // providers: [AppService],
})
export class ApplicationModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(CountMiddleware, FiterDataMiddleware).forRoutes(AppController);
    }
}

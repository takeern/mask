import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from './app.module';
import { WsAdapter } from '@nestjs/websockets/adapters';
import { ValidationPipe } from './middleware/validation.pipe';


const heapdump = require('heapdump');
const memwatch = require('node-memwatch');
declare const module: any;

async function bootstrap() {
    const app = await NestFactory.create(ApplicationModule, {
        bodyParse: false,
    });
    app.useWebSocketAdapter(new WsAdapter(app.getHttpServer()));
    app.useGlobalPipes(new ValidationPipe());
    await app.listen(4000);

    if (module.hot) {
        module.hot.accept();
        module.hot.dispose(() => app.close());
    }
}
bootstrap();

// memwatch.on('leak', (info) => console.log('leak', info));
// memwatch.on('stats', (info) => console.log('stats', info));
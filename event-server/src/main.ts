import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use((req, res, next) => {
    const isFromGateway =
      req.headers['x-from-gateway'].toLowerCase() === 'true';
    if (!isFromGateway) {
      return res.status(403).json({
        message: 'event-server는 gateway를 통해서만 접근 가능합니다.',
      });
    }
    next();
  });
  await app.listen(3002);
}
bootstrap();

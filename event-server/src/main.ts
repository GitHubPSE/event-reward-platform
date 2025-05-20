import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use((req, res, next) => {
   const xFromGateway = req.headers['x-from-gateway'];

    if (!xFromGateway || xFromGateway.toString().toLowerCase() !== 'true') {
      return res.status(403).json({
        message: '비정상 접근입니다.',
      });
    }
    next();
  });
  await app.listen(3002);
}
bootstrap();

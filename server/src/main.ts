import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://192.168.101.2:5173', // 允许5173端口的跨域请求
  });
  // pipeline 类型校验
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000, '192.168.101.2');
}

bootstrap();

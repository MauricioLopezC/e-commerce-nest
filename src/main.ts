import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true
  }))

  app.use(cookieParser());
  app.enableCors({
    origin: ["http://localhost:8080"], //nextjs frontend
    credentials: true
  });
  //without this configuration for origin and credentials
  //the browser not allow set cookie
  await app.listen(3000);
}
bootstrap();

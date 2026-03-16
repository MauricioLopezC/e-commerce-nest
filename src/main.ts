import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { PrismaExceptionFilter } from './common/filters/prisma-client-exception/prisma-client-exception.filter';
import { BusinessExceptionFilter } from './common/filters/business-exception/business-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ErrorResponseDto } from './common/dto/error-response.dto';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(
    new PrismaExceptionFilter(),
    new BusinessExceptionFilter(),
  );

  const config = new DocumentBuilder()
    .setTitle('E-commerce api')
    .setDescription('Api of the Martina clothing store')
    .setVersion('1.0')
    .addGlobalResponse({
      status: 500,
      description: 'Internal server error',
      type: ErrorResponseDto,
    })
    .addGlobalResponse({
      status: '4XX',
      description: 'Default error response',
      type: ErrorResponseDto,
    })
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.enableShutdownHooks();
  app.use(helmet());
  app.use(cookieParser());
  app.enableCors({
    origin: [process.env.FRONTEND_URL || 'http://localhost:8080'],
    credentials: true,
  });
  //without this configuration for origin and credentials,
  //the browser doesn't allow set cookie
  await app.listen(process.env.PORT || 3000);
}
bootstrap();

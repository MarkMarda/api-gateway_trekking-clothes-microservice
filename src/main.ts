import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Enable CORS
  app.enableCors();

  const logger = new Logger('Bootstrap');

  //Versioning the API
  app.setGlobalPrefix('api/v1');

  //Config global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  //Config openApi Specification
  const config = new DocumentBuilder()
    .setTitle('API Gateway Microservice')
    .setDescription('API Gateway Microservice')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT);

  logger.log(`Application listening on port ${process.env.PORT}`);
}
bootstrap();

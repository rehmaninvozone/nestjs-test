import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { useContainer } from 'class-validator';
import { ConfigService } from '@nestjs/config';
import { CorsConfig, NestConfig } from './common/config/config.interface';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Setting up class-validator to use NestJS container
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  // Global validation pipe to enforce validation rules on incoming requests
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Applying Helmet middleware for setting various security-related HTTP headers
  app.use(helmet());

  // Global interceptor to transform responses using class serialization
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // Retrieving configuration service to access environment variables and application configurations
  const configService = app.get(ConfigService);

  // Getting NestJS configuration and CORS configuration from the configuration service
  const nestConfig = configService.get<NestConfig>('nest');
  const corsConfig = configService.get<CorsConfig>('cors');

  // Enable CORS if configured to do so
  if (corsConfig?.enabled) {
    app.enableCors();
  }
  const config = new DocumentBuilder()
    .setTitle('Nest js Basic Auth')
    .setDescription(
      'These apis contain users auth using invitation based auth with task crud',
    )
    .setVersion('1.0')
    .addTag('nestjs')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT || nestConfig?.port || 3000);
}

bootstrap();

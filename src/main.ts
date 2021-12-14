import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionFilter } from './common/filters/http-exception.filter';
import { RedocModule, RedocOptions } from 'nestjs-redoc';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new AllExceptionFilter());

  const options = new DocumentBuilder()
    .setTitle('Document Bank API')
    .setDescription('documentation for bank api')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);

  const redocOptions: RedocOptions = {
    favicon:
      'https://www.hostinger.es/tutoriales/wp-content/uploads/sites/7/2019/05/wordpress-favicon.jpg',
    title: 'API Reservas',
    logo: {
      url: 'https://www.hostinger.es/tutoriales/wp-content/uploads/sites/7/2019/05/wordpress-favicon.jpg',
      backgroundColor: '#0082B7',
    },
    sortPropsAlphabetically: true,
    hideDownloadButton: false,
    hideHostname: false,
    noAutoAuth: false,
  };

  SwaggerModule.setup('/api/swagger', app, document, {
    swaggerOptions: {
      filter: true,
    },
  });

  await RedocModule.setup('/api/docs', app, document, redocOptions);
  await app.listen(process.env.PORT || 3000);
}

bootstrap();

import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './custom-exception-filter.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Dashboard Api Documentation')
    .setDescription('This is Api Service')
    .setVersion('1.0')
    .addTag('apis')
    .build();
  app.enableCors({
    origin: '*',
  });
  app.setGlobalPrefix('api');
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  await app.listen(3000);
}
bootstrap();

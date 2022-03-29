import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import * as firebase_admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Gravity')
    .setDescription('Gravity')
    .setVersion('1.0.0')
    .build();

  const adminConfig: ServiceAccount = {
    "projectId": process.env.FIREBASE_PROJECT_ID,
    "clientEmail": process.env.FIREBASE_EMAIL,
    "privateKey": process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
  }

  firebase_admin.initializeApp({
    credential: firebase_admin.credential.cert(adminConfig)
  })  
  
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalGuards();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(parseInt(process.env.APP_PORT) || 3000);
}
bootstrap();

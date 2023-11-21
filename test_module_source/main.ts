import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as fs from 'fs';
import { INestApplication } from '@nestjs/common';

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync(__dirname + '/cert/localhost.key'),
    cert: fs.readFileSync(__dirname + '/cert/localhost.crt'),
  };
  const app = await NestFactory.create<INestApplication>(AppModule, {
    httpsOptions,
  });
  app.use(
    session({
      secret: '123',
      resave: false, //Prevent changing data
      saveUninitialized: false, //Prevent initial session
    }),
  ),
    await app.listen(5000);
}
bootstrap();

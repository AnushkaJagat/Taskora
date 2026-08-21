import 'dotenv/config';
import mongoose from 'mongoose';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  await mongoose.connect(process.env.MONGODB_URI);

  console.log('MongoDB connected successfully');

  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://taskora0.netlify.app',
    ],
  });

  await app.listen(process.env.PORT || 3004);
}

bootstrap();
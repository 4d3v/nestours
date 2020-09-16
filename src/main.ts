import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TourDifficulty } from './tours/tour-difficulty.enum';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();

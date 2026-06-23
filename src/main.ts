import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './config/envs';
import { logger } from './config/logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors();
  await app.listen(envs.PORT);
  logger.info(`Pet Radar escuchando en puerto ${envs.PORT}`);
}
bootstrap();

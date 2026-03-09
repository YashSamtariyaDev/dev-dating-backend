import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const httpsEnabled = process.env.HTTPS === 'true';
  let httpsOptions;

  if (httpsEnabled) {
    try {
      httpsOptions = {
        key: readFileSync(join(process.cwd(), 'ssl', 'server.key')),
        cert: readFileSync(join(process.cwd(), 'ssl', 'server.crt')),
      };
    } catch (err) {
      Logger.warn('HTTPS enabled but SSL certificates not found in ./ssl/. Falling back to HTTP.', 'Bootstrap');
    }
  }

  const app = await NestFactory.create<NestExpressApplication>(AppModule, httpsOptions ? { httpsOptions } : undefined);

  // Serve static files from uploads directory
  app.useStaticAssets(join(__dirname, '..', 'uploads'));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.PORT ?? (httpsEnabled ? 443 : 3000);
  await app.listen(port);

  const protocol = httpsOptions ? 'https' : 'http';
  Logger.log(`🚀 Application is running on: ${protocol}://localhost:${port}`, 'Bootstrap');
}
bootstrap();

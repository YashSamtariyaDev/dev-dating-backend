import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { json, urlencoded } from 'express';

async function bootstrap() {
  // 🔍 Debug logging for Railway deployment
  console.log('🔍 Environment check starts...');
  console.log(`🔍 NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`🔍 Available Env Keys: ${Object.keys(process.env).join(', ')}`);
  console.log(`🔍 JWT_ACCESS_SECRET check: ${process.env.JWT_ACCESS_SECRET ? 'PRESENT (HIDDEN)' : 'MISSING'}`);
  if (process.env.JWT_ACCESS_SECRET) {
      console.log(`🔍 JWT_ACCESS_SECRET snippet: ${process.env.JWT_ACCESS_SECRET.substring(0, 3)}...`);
  }
  
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

  // Increase payload limit for large JSON/URL-encoded requests
  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ limit: '10mb', extended: true }));

  // Diagnostic middleware
  app.use((req, res, next) => {
    if (req.url.includes('upload-photo') || (req.method === 'PATCH' && req.url.includes('profile/me'))) {
      console.log(`📥 Backend Received: ${req.method} ${req.url}`);
      console.log(`📥 Content-Type: ${req.headers['content-type']}`);
      console.log(`📥 Authorization: ${req.headers.authorization ? 'Present' : 'Missing'}`);
      if (req.headers.authorization) {
         console.log(`📥 Token snippet: ${req.headers.authorization.substring(0, 25)}...`);
      }
    }
    next();
  });

  // Serve static files from uploads directory with /uploads prefix
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.PORT ?? (httpsEnabled ? 443 : 3000);
  await app.listen(port, '0.0.0.0');

  const protocol = httpsOptions ? 'https' : 'http';
  const host = '192.168.1.35'; // Local IP
  Logger.log(`🚀 Application is running on: ${protocol}://${host}:${port}`, 'Bootstrap');
}
bootstrap();

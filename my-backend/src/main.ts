import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ensureDatabaseExists } from './config/ensure-database';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  if (process.env.DATABASE_URL) {
    await ensureDatabaseExists(process.env.DATABASE_URL);
  }
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );
  const corsEnv = process.env.CORS_ORIGIN;
  const origins = corsEnv
    ? corsEnv.split(',').map((s) => s.trim()).filter(Boolean)
    : ['http://localhost:5173'];
  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // Allow access to Swagger UI from any origin
      if (origin.includes('swagger') || origin.includes('docs')) {
        return callback(null, true);
      }

      // Check against allowed origins for API routes
      if (origins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'));
    }
  });

  const config = new DocumentBuilder()
    .setTitle('Highway Delite API')
    .setDescription('API documentation for the Highway Delite backend')
    .setVersion('1.0.0')
    .addServer(process.env.NODE_ENV === 'production' 
      ? 'https://bookit-backend-bay.vercel.app' 
      : 'http://localhost:3000')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  
  // Configure Swagger UI with default header style
  const swaggerOptions = {
    customSiteTitle: 'BookIt API Documentation',
    customfavIcon: 'https://bookit-eight-theta.vercel.app/favicon.ico',
    swaggerOptions: {
      docExpansion: 'list',
      filter: true,
      showRequestDuration: true,
    },
    customCss: `
      .swagger-ui .topbar { 
        background-color: #1e293b;
        padding: 10px 0;
      }
      .swagger-ui .info .title { 
        color: #333; 
        font-size: 24px; 
        margin: 0 0 20px; 
      }
    `
  };

  SwaggerModule.setup('docs', app, document, swaggerOptions);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

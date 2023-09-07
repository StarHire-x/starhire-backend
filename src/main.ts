import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //frontend admin
  // app.use(cors({
  //   origin: 'http://localhost:3000', 
  //   methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  // }));

  //frontend client
  // app.use(cors({
  //   origin: 'http://localhost:3001', 
  //   methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  // }));

  app.enableCors({
    origin: ['http://localhost:3000','http://localhost:3001'], // Allow requests from this origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed HTTP methods
    credentials: true, // Allow credentials (cookies, headers, etc.)
  });
  
  //backend server
  await app.listen(8080);
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //frontend client 1
  app.use(cors({
    origin: 'http://localhost:3000', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  }));
  
  //backend server
  await app.listen(8080);
}
bootstrap();

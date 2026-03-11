import { NestFactory } from '@nestjs/core';
import { createClient } from 'redis';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { RedisIoAdapter } from './redis-io.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const redisUrl = process.env.REDIS_URL;
  if (redisUrl) {
    const pubClient = createClient({ url: redisUrl });
    const subClient = pubClient.duplicate();
    await Promise.all([pubClient.connect(), subClient.connect()]);
    app.useWebSocketAdapter(new RedisIoAdapter(app, pubClient, subClient));
  } else {
    app.useWebSocketAdapter(new IoAdapter(app));
  }

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

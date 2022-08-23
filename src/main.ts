import { AppModule } from './app.module';

import { ValidationPipe } from '@nestjs/common/pipes';
import { NestFactory } from '@nestjs/core';

async function main() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  await app.listen(process.env.PORT, () => {
    console.log(`Server is running in PORT: ${process.env.PORT}`);
  });
}

main();

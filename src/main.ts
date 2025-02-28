import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import {
  BadRequestException,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { resolve } from 'node:path';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.useStaticAssets({
    prefix: '/public',
    root: resolve(__dirname, 'public'),
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      errorHttpStatusCode: HttpStatus.BAD_REQUEST,
      exceptionFactory: (errors) => {
        const errorText = JSON.stringify(
          errors.reduce<{ [type: string]: string }[]>(
            (constrains, currentError) => {
              if (currentError.constraints === undefined) {
                return constrains;
              }

              return constrains.concat(currentError.constraints);
            },
            [],
          ),
        );

        return new BadRequestException(errorText);
      },
    }),
  );

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.log(`Application is running on port: ${port}.`);
}

bootstrap();

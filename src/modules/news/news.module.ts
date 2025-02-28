import Handlebars from 'handlebars';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateNewsCommandHandler } from '@news/infrastructure/commands/create-news.command-handler';
import { GetAllNewsWithDateHandler } from '@news/infrastructure/queries/get-all-news-with-date.query-handler';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { NewsApiController } from '@news/infrastructure/controllers/news.api-controller';
import { NewsEntity } from '@news/infrastructure/database/entities/news.entity';
import { NewsRepository } from '@news/infrastructure/database/repositories/news.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsTemplater } from '@news/infrastructure/templater/news.templater';
import { CreateNewsReportCommandHandler } from '@news/infrastructure/commands/create-news-report.command-handler';
import { FilesModule } from 'src/modules/files/files.module';

export const TemplaterProviderToken = Symbol('TemplaterProviderToken');

const modules = [
  CqrsModule,
  FilesModule,
  HttpModule,
  TypeOrmModule.forFeature([NewsEntity]),
];

const apiControllers = [NewsApiController];

const repositories = [{ provide: NewsRepository, useClass: NewsRepository }];

const queryHandlers = [GetAllNewsWithDateHandler];

const commandHandlers = [
  CreateNewsCommandHandler,
  CreateNewsReportCommandHandler,
];

const otherProviders = [
  {
    provide: NewsTemplater,
    useFactory: () => {
      return new NewsTemplater(Handlebars.create());
    },
  },
];

@Module({
  controllers: [...apiControllers],
  imports: [...modules],
  providers: [
    ...repositories,
    ...queryHandlers,
    ...commandHandlers,
    ...otherProviders,
  ],
})
export class NewsModule {}

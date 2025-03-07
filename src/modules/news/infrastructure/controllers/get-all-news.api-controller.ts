import { Controller, Get, InternalServerErrorException } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetAllNewsWithDateQuery } from '@news/application/queries/get-all-news-with-date.query';
import { GetAllNewsWithDateResult } from '@news/application/queries/get-all-news-with-date.query-handler';
import { NewsDto } from '@shared/dtos/news.dto';

@Controller('get-all-news')
export class GetAllNewsController {
  public constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get()
  public async getAllNews(): Promise<NewsDto[]> {
    try {
      return this.queryBus.execute<
        GetAllNewsWithDateQuery,
        GetAllNewsWithDateResult
      >(new GetAllNewsWithDateQuery());
    } catch (_error) {
      throw new InternalServerErrorException(
        'Unable to get news. Something went wrong',
      );
    }
  }
}

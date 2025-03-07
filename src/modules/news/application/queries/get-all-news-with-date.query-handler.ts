import { GetAllNewsWithDateQuery } from '@news/application/queries/get-all-news-with-date.query';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NewsDto } from '@shared/dtos/news.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

export type GetAllNewsWithDateResult = NewsDto[];

@QueryHandler(GetAllNewsWithDateQuery)
export class GetAllNewsWithDateHandler
  implements IQueryHandler<GetAllNewsWithDateQuery>
{
  public constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  public async execute(): Promise<GetAllNewsWithDateResult> {
    return this.dataSource.query<NewsDto[]>('SELECT * FROM news');
  }
}

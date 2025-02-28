import { GetAllNewsWithDateQuery } from '@news/infrastructure/queries/get-all-news-with-date.query';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NewsDto } from '@shared/dtos/news.dto';
import { NewsRepository } from '@news/infrastructure/database/repositories/news.repository';
import { NewsRepositoryInterface } from '@news/domain/interfaces/news-repository.interface';
import { Inject } from '@nestjs/common';

export type GetAllNewsWithDateResult = NewsDto[];

@QueryHandler(GetAllNewsWithDateQuery)
export class GetAllNewsWithDateHandler
  implements IQueryHandler<GetAllNewsWithDateQuery>
{
  public constructor(
    @Inject(NewsRepository)
    private readonly newsRepository: NewsRepositoryInterface,
  ) {}

  public async execute(): Promise<GetAllNewsWithDateResult> {
    const news = await this.newsRepository.getAllNews();

    return news.map((item) => {
      return {
        id: item.id.value,
        createdAt: item.createdAt.toString(),
        url: item.url,
        title: item.title,
      };
    });
  }
}

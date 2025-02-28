import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateNewsCommand } from '@news/infrastructure/commands/create-news.command';
import { Inject } from '@nestjs/common';
import { News } from '@news/domain/news';
import { NewsRepository } from '@news/infrastructure/database/repositories/news.repository';
import { NewsRepositoryInterface } from '@news/domain/interfaces/news-repository.interface';

export type CreateNewsResult = string;

@CommandHandler(CreateNewsCommand)
export class CreateNewsCommandHandler
  implements ICommandHandler<CreateNewsCommand>
{
  public constructor(
    @Inject(NewsRepository)
    private readonly newsRepository: NewsRepositoryInterface,
  ) {}

  public async execute(command: CreateNewsCommand): Promise<CreateNewsResult> {
    const news = await this.newsRepository.createNews(
      News.create({
        url: command.url,
        title: command.title,
      }),
    );

    return news.id.value;
  }
}

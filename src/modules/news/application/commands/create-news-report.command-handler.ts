import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateNewsReportCommand } from '@news/application/commands/create-news-report.command';
import { Inject } from '@nestjs/common';
import { NewsRepository } from '@news/infrastructure/database/repositories/news.repository';
import { NewsRepositoryInterface } from '@news/domain/interfaces/news-repository.interface';
import { NewsTemplater } from '@news/infrastructure/templater/news.templater';
import { NewsTemplaterInterface } from '@news/domain/interfaces/news-templater.interface';

export type CreateNewsReportResult = string;

@CommandHandler(CreateNewsReportCommand)
export class CreateNewsReportCommandHandler
  implements ICommandHandler<CreateNewsReportCommand>
{
  public constructor(
    @Inject(NewsRepository)
    private readonly newsRepository: NewsRepositoryInterface,
    @Inject(NewsTemplater)
    private readonly newsTemplater: NewsTemplaterInterface,
  ) {}

  public async execute({
    ids,
  }: CreateNewsReportCommand): Promise<CreateNewsReportResult> {
    const news = await this.newsRepository.getNewsByIds(ids);
    const newsReportText = await this.newsTemplater.createNewsReport(news);

    return newsReportText;
  }
}

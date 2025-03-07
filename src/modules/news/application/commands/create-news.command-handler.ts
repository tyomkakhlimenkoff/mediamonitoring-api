import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateNewsCommand } from '@news/application/commands/create-news.command';
import { Inject } from '@nestjs/common';
import { News } from '@news/domain/news';
import { NewsRepository } from '@news/infrastructure/database/repositories/news.repository';
import { NewsRepositoryInterface } from '@news/domain/interfaces/news-repository.interface';
import { CreateNewsDto } from '@news/application/dtos/create-news.dto';
import { BadResponseError } from '@news/application/commands/errors/bad-response.error';
import { UnableToGetTitleFromPageError } from '@news/application/commands/errors/unable-to-get-title-from-page.error';
import { HttpService } from '@nestjs/axios';
import { ChildNode, Document } from 'parse5/dist/tree-adapters/default';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
import { parse } from 'parse5';

@CommandHandler(CreateNewsCommand)
export class CreateNewsCommandHandler
  implements ICommandHandler<CreateNewsCommand>
{
  public constructor(
    private readonly httpService: HttpService,
    @Inject(NewsRepository)
    private readonly newsRepository: NewsRepositoryInterface,
  ) {}

  public async execute({ url }: CreateNewsCommand): Promise<CreateNewsDto> {
    let response: AxiosResponse;

    try {
      response = await firstValueFrom(
        this.httpService.get(url, { responseType: 'text' }),
      );
    } catch (_error) {
      throw new BadResponseError(url);
    }

    if (typeof response.data !== 'string') {
      throw new UnableToGetTitleFromPageError(url);
    }

    const title = this.getTitleFromDocument(parse(response.data));
    if (title === null) {
      throw new UnableToGetTitleFromPageError(url);
    }

    const news = News.create({ url, title });

    await this.newsRepository.createNews(news);

    return new CreateNewsDto(news.id.value);
  }

  private getTitleFromDocument(
    node: Document | ChildNode | null,
  ): string | null {
    if (node === null) {
      return null;
    }

    if (!('childNodes' in node)) {
      return null;
    }

    if (node.nodeName === 'title') {
      if (
        !('value' in node.childNodes[0]) ||
        node.childNodes[0].value.length <= 0
      ) {
        return null;
      }

      return node.childNodes[0].value;
    }

    const titleFoundInChildren = node.childNodes.reduce(
      (foundValue: string | null, currentChild: ChildNode) => {
        const result = this.getTitleFromDocument(currentChild);

        if (result === null) {
          return foundValue;
        }

        return result;
      },
      null,
    );

    return titleFoundInChildren;
  }
}

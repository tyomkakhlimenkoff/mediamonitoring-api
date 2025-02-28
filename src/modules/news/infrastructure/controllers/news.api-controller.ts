import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateFileCommand } from 'src/modules/files/infrastructure/commands/create-file.command';
import { CreateFileResult } from 'src/modules/files/infrastructure/commands/create-file.command-handler';
import { CreateNewsCommand } from '@news/infrastructure/commands/create-news.command';
import { CreateNewsReportCommand } from '@news/infrastructure/commands/create-news-report.command';
import { CreateNewsReportResult } from '@news/infrastructure/commands/create-news-report.command-handler';
import { CreateNewsResult } from '@news/infrastructure/commands/create-news.command-handler';
import { FileType } from 'src/modules/files/application/enums/file-type.enum';
import { GetAllNewsWithDateQuery } from '@news/infrastructure/queries/get-all-news-with-date.query';
import { GetAllNewsWithDateResult } from '@news/infrastructure/queries/get-all-news-with-date.query-handler';
import { GetNewsReportRequest } from '@news/infrastructure/controllers/requests/get-news-report.request';
import { CreateNewsRequest } from '@news/infrastructure/controllers/requests/create-news.request';
import { NewsDto } from '@shared/dtos/news.dto';
import { ChildNode, Document } from 'parse5/dist/tree-adapters/default';
import { AxiosResponse } from 'axios';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { parse } from 'parse5';

@Controller('news')
export class NewsApiController {
  public constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
    private readonly httpService: HttpService,
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

  @Post()
  public async createNews(@Body() { url }: CreateNewsRequest): Promise<string> {
    try {
      let response: AxiosResponse;

      try {
        response = await firstValueFrom(
          this.httpService.get(url, { responseType: 'text' }),
        );
      } catch (_error) {
        throw new BadRequestException(`Can't get data from URL: ${url}`);
      }

      const unableToGetTitleError = new BadRequestException(
        `Unable to get title for HTML page from URL: ${url}`,
      );

      if (typeof response.data !== 'string') {
        throw unableToGetTitleError;
      }

      const document = parse(response.data);
      const title = this.getTitleFromDocument(document);

      if (title === null) {
        throw unableToGetTitleError;
      }

      return this.commandBus.execute<CreateNewsCommand, CreateNewsResult>(
        new CreateNewsCommand(url, title),
      );
    } catch (_error) {
      throw new InternalServerErrorException(
        `Unable to create news for given URL: ${url}`,
      );
    }
  }

  @Post('/report')
  public async createNewsReport(
    @Body() { newsIds }: GetNewsReportRequest,
  ): Promise<string> {
    try {
      const newsReportText = await this.commandBus.execute<
        CreateNewsReportCommand,
        CreateNewsReportResult
      >(new CreateNewsReportCommand(newsIds));

      const filePath = await this.commandBus.execute<
        CreateFileCommand,
        CreateFileResult
      >(new CreateFileCommand(newsReportText, FileType.Html));

      return filePath;
    } catch (_error) {
      const ids = newsIds.map((id) => id.value).join(',');

      throw new InternalServerErrorException(
        `Unable to create report for given id's: ${ids}`,
      );
    }
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

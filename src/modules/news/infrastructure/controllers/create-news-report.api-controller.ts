import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateFileCommand } from 'src/modules/files/application/commands/create-file.command';
import { CreateFileResult } from 'src/modules/files/application/commands/create-file.command-handler';
import { CreateNewsReportCommand } from '@news/application/commands/create-news-report.command';
import { CreateNewsReportResult } from '@news/application/commands/create-news-report.command-handler';
import { FileType } from 'src/modules/files/application/commands/create-file.command';
import { GetNewsReportRequest } from '@news/infrastructure/controllers/requests/get-news-report.request';

@Controller('create-news-report')
export class CreateNewsReportController {
  public constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

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
      >(new CreateFileCommand(newsReportText, FileType.HTML));

      return filePath;
    } catch (_error) {
      const ids = newsIds.map((id) => id.value).join(',');

      throw new InternalServerErrorException(
        `Unable to create report for given id's: ${ids}`,
      );
    }
  }
}

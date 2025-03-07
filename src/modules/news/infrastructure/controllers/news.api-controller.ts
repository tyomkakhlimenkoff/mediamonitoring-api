import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateNewsCommand } from '@news/application/commands/create-news.command';
import { CreateNewsDto } from '@news/application/dtos/create-news.dto';
import { CreateNewsRequest } from '@news/infrastructure/controllers/requests/create-news.request';

@Controller('news')
export class CreateNewsController {
  public constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Post()
  public async createNews(@Body() { url }: CreateNewsRequest): Promise<string> {
    try {
      const newsId = await this.commandBus.execute<
        CreateNewsCommand,
        CreateNewsDto
      >(new CreateNewsCommand(url));

      return newsId.id;
    } catch (_error) {
      throw new InternalServerErrorException(
        `Unable to create news for given URL: ${url}`,
      );
    }
  }
}

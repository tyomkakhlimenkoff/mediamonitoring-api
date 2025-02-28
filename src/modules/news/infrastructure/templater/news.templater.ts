import Handlebars from 'handlebars';
import { Inject } from '@nestjs/common';
import { News } from '@news/domain/news';
import { NewsTemplaterInterface } from '@news/domain/interfaces/news-templater.interface';
import { TemplaterProviderToken } from '@news/news.module';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

export class NewsTemplater implements NewsTemplaterInterface {
  private readonly templateFolderPath = resolve(__dirname, 'templates');

  public constructor(
    @Inject(TemplaterProviderToken)
    private readonly templater: typeof Handlebars,
  ) {}

  public async createNewsReport(news: News[]): Promise<string> {
    const templateFilePath = resolve(
      this.templateFolderPath,
      'news-report.template.hbs',
    );

    const blankTemplate = await readFile(templateFilePath, {
      encoding: 'utf-8',
    });

    const fillTemplateWithData = this.templater.compile(blankTemplate);

    const data = news.map((item) => {
      return {
        url: item.url,
        title: item.title,
      };
    });

    return fillTemplateWithData({ news: data });
  }
}

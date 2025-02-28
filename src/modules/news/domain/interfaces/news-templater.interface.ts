import { News } from '@news/domain/news';

export interface NewsTemplaterInterface {
  createNewsReport(news: News[]): Promise<string>;
}

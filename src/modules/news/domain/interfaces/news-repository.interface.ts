import { Uuid } from '@shared/value-objects/uuid';
import { News } from '@news/domain/news';

export interface NewsRepositoryInterface {
  createNews(news: News): Promise<void>;
  getNewsByIds(ids: Uuid[]): Promise<News[]>;
  getAllNews(): Promise<News[]>;
}

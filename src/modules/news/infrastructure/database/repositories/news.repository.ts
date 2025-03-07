import { Uuid } from '@shared/value-objects/uuid';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { News } from '@news/domain/news';
import { NewsEntity } from '@news/infrastructure/database/entities/news.entity';
import { NewsRepositoryInterface } from '@news/domain/interfaces/news-repository.interface';

export class NewsRepository
  extends Repository<NewsEntity>
  implements NewsRepositoryInterface
{
  public constructor(
    @InjectRepository(NewsEntity) repository: Repository<NewsEntity>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  private readonly TABLE_NAME = 'news';

  public async createNews(news: News): Promise<void> {
    await this.save({
      id: news.id,
      title: news.title,
      url: news.url,
    });
  }

  public async getNewsByIds(ids: Uuid[]): Promise<News[]> {
    const news = await this.manager.query(
      `SELECT * FROM ${this.TABLE_NAME} WHERE id IN (${ids.map((id) => `'${id}'`).join(', ')})`,
    );

    return news.map((item: NewsEntity) => this.toDomainEntity(item));
  }

  public async getAllNews(): Promise<News[]> {
    const news = await this.manager.query(`SELECT * FROM ${this.TABLE_NAME}`);

    return news.map((item: NewsEntity) => this.toDomainEntity(item));
  }

  private toDomainEntity(dbEntity: NewsEntity): News {
    const { id, url, title, createdAt, updatedAt } = dbEntity;

    return News.load(id, { url, title, createdAt, updatedAt });
  }
}

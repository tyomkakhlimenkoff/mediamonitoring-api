import { ColumnUuidTransformer } from '@configs/database/transformers/column-uuid.transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  Index,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Uuid } from '@shared/value-objects/uuid';

@Entity()
@Index('IDX_UQ_news_url', ['url'], { unique: true })
@Index('IDX_news_createdAt', ['createdAt'])
export class NewsEntity {
  @Generated('uuid')
  @PrimaryColumn({
    transformer: new ColumnUuidTransformer(),
    type: 'uuid',
    unique: true,
  })
  public id: Uuid;

  @CreateDateColumn({ type: 'timestamptz' })
  public createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  public updatedAt: Date;

  @Column({ nullable: false, type: 'varchar' })
  public url: string;

  @Column({ nullable: false, type: 'varchar' })
  public title: string;
}

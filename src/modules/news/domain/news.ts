import { EmptyTitleError } from '@news/domain/errors/empty-title.error';
import { InvalidUrlError } from '@news/domain/errors/invalid-url.error';
import { Uuid } from '@shared/value-objects/uuid';
import { isURL } from 'validator';

type NewsProps = {
  id: Uuid;
  url: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
};

type CreateNewsProps = {
  url: string;
  title: string;
};

type LoadNewsProps = {
  url: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
};

export class News {
  private constructor(private readonly props: NewsProps) {}

  public get id(): Uuid {
    return this.props.id;
  }

  public get url(): string {
    return this.props.url;
  }

  public get title(): string {
    return this.props.title;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public get updatedAt(): Date {
    return this.props.updatedAt;
  }

  public static create(props: CreateNewsProps): News {
    if (!isURL(props.url)) {
      throw new InvalidUrlError(props.url);
    }

    if (!props.title.length) {
      throw new EmptyTitleError();
    }

    return this.load(Uuid.generate(), {
      ...props,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  public static load(id: Uuid, props: LoadNewsProps): News {
    return new News({ id, ...props });
  }
}

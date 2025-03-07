import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  CreateFileCommand,
  FileType,
} from 'src/modules/files/application/commands/create-file.command';
import { Uuid } from '@shared/value-objects/uuid';
import { UnableToGetFileNameError } from 'src/modules/files/application/commands/errors/unable-to-get-file-name.error';
import { UnableToSaveFileError } from 'src/modules/files/application/commands/errors/unable-to-save-file.error';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

export type CreateFileResult = string;

@CommandHandler(CreateFileCommand)
export class CreateFileCommandHandler
  implements ICommandHandler<CreateFileCommand>
{
  private readonly filesFolderPath = resolve(
    process.cwd(),
    'dist',
    'public',
    'files',
  );

  public async execute({
    fileContent,
    fileType,
  }: CreateFileCommand): Promise<CreateFileResult> {
    const fileName = this.getFileName(fileType);
    const filePath = resolve(this.filesFolderPath, fileName);

    await mkdir(this.filesFolderPath, { recursive: true });
    await this.saveFile(filePath, fileContent, fileType);

    return `/public/files/${fileName}`;
  }

  private getFileName(fileType: FileType): string {
    const fileId = Uuid.generate().value;

    switch (fileType) {
      case FileType.HTML:
        return `${fileId}.html`;
      default:
        throw new UnableToGetFileNameError(fileType, fileId);
    }
  }

  private async saveFile(
    filePath: string,
    fileContent: string,
    fileType: FileType,
  ): Promise<void> {
    switch (fileType) {
      case FileType.HTML:
        await writeFile(filePath, fileContent, { encoding: 'utf-8' });

        return;
      default:
        throw new UnableToSaveFileError(filePath);
    }
  }
}

import { CreateFileCommandHandler } from 'src/modules/files/infrastructure/commands/create-file.command-handler';
import { Module } from '@nestjs/common';

const commandHandlers = [CreateFileCommandHandler];

@Module({
  providers: [...commandHandlers],
})
export class FilesModule {}

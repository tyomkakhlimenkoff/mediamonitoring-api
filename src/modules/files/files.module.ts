import { CreateFileCommandHandler } from 'src/modules/files/application/commands/create-file.command-handler';
import { Module } from '@nestjs/common';

const commandHandlers = [CreateFileCommandHandler];

@Module({
  providers: [...commandHandlers],
})
export class FilesModule {}

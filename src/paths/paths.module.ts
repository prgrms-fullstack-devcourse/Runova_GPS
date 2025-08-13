import { Module } from '@nestjs/common';
import { PathsService } from './paths.service';

@Module({
  providers: [PathsService]
})
export class PathsModule {}

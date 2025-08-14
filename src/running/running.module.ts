import { Module } from '@nestjs/common';
import { RunningCoursesService } from './service';

@Module({
  providers: [RunningCoursesService]
})
export class RunningModule {}

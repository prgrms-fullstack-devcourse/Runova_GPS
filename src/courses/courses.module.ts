import { Module } from '@nestjs/common';
import { CoursesService } from './service';

@Module({
  providers: [CoursesService]
})
export class CoursesModule {}

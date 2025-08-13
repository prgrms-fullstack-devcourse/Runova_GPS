import { Module } from '@nestjs/common';
import { CoursesService } from './service/courses.service';

@Module({
  providers: [CoursesService]
})
export class CoursesModule {}

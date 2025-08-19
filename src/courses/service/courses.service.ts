import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Course } from "../model";
import { In, Repository } from "typeorm";
import { CourseDTO, GetCoursesDTO } from "../dto";
import { pick } from "../../utils/object";
import { Coordinates } from "../../common/geo";
import { DateTimeFormatter, nativeJs } from "@js-joda/core";
import { Transactional } from "typeorm-transactional";
import { CoursePreviewService } from "./course.preview.service";
import { CourseInstructionsService } from "./course.instructions.service";

@Injectable()
export class CoursesService {
    private readonly _formatter: DateTimeFormatter
        = DateTimeFormatter.ofPattern("HH:mm:ss");

    constructor(
        @InjectRepository(Course)
        private readonly _coursesRepo: Repository<Course>,
        @Inject(CoursePreviewService)
        private readonly _previewService: CoursePreviewService,
        @Inject(CourseInstructionsService)
        private readonly _instructionsService: CourseInstructionsService,
    ) {}

    @Transactional()
    async createCourse(userId: number, path: Coordinates[]): Promise<CourseDTO> {
        const preview = await this._previewService.makePreview(path);
        const course: Course = await this._coursesRepo.save({ userId, ...preview });
        await this._instructionsService.createCourseInstructions(course.id);
        return this.toCourseDTO(course);
    }

    async getCourses(dto: GetCoursesDTO): Promise<CourseDTO[]> {
        const { ids, userId } = dto;

        const courses = await this._coursesRepo.findBy({
            id: ids?.length && In(ids),
            userId,
        });

        return courses.map(c => this.toCourseDTO(c));
    }

    @Transactional()
    async deleteCourse(id: number, userId: number): Promise<void> {
        await this._coursesRepo.delete({ id, userId, });
    }

    private toCourseDTO(course: Course): CourseDTO {

        const estimatedTime = nativeJs(course.time)
            .toLocalTime().format(this._formatter);

        return {
            estimatedTime,
            ...pick(course, ["id", "length", "path"]),
        };
    }

}

import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Course } from "../model";
import { In, Repository } from "typeorm";
import { CourseDTO, GetCoursesDTO } from "../dto";
import { pick } from "../../utils/object";
import { ConfigService } from "@nestjs/config";
import { EstimateTimeService } from "./estimate.time.service";
import { Coordinates } from "../../common/geo";

@Injectable()
export class CoursesService {
    private readonly _tolerance: number;

    constructor(
        @InjectRepository(Course)
        private readonly _coursesRepo: Repository<Course>,
        @Inject(EstimateTimeService)
        private readonly _estimateTimeService: EstimateTimeService,
        @Inject(ConfigService)
        config: ConfigService,
    ) {

    }

    async createCourse(userId: number, path: Coordinates[]): Promise<CourseDTO> {
        return await this._coursesRepo.save({ userId, path })
            .then((c: Course) => this.toCourseDTO(c))
            .catch(err => { throw err; });
    }

    async getCourses(dto: GetCoursesDTO): Promise<CourseDTO[]> {
        const { ids, userId } = dto;

        const courses = await this._coursesRepo.findBy({
            id: ids?.length && In(ids),
            userId,
        });

        return courses.map(c => this.toCourseDTO(c));
    }

    private toCourseDTO(course: Course): CourseDTO {
        const estimatedTime = this._estimateTimeService.estimateTime(course.id);

        return {
            estimatedTime,
            ...pick(course, ["id", "length", "path"]),
        };
    }

}

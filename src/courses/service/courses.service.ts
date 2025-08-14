import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Course } from "../model";
import { In, Repository } from "typeorm";
import { CourseDTO, CourseSegmentsDTO, GetCoursesDTO } from "../dto";
import { pick } from "../../utils/object";
import { EstimateTimeService } from "./estimate.time.service";
import { Coordinates } from "../../common/geo";
import { plainToInstance } from "class-transformer";
import { SelectSegments } from "./service.internal";

@Injectable()
export class CoursesService {

    constructor(
        @InjectRepository(Course)
        private readonly _coursesRepo: Repository<Course>,
        @Inject(EstimateTimeService)
        private readonly _estimateTimeService: EstimateTimeService,
    ) {}

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

    async getCourseSegments(id: number): Promise<CourseSegmentsDTO> {

        const raw = await this._coursesRepo
            .createQueryBuilder("course")
            .select(SelectSegments("course", "path"))
            .where("course.id = :id", { id })
            .getRawOne();

        if (!raw) throw new NotFoundException();
        return plainToInstance(CourseSegmentsDTO, raw);
    }

    async deleteCourse(id: number, userId: number): Promise<void> {
        await this._coursesRepo.delete({ id, userId, });
    }

    private toCourseDTO(course: Course): CourseDTO {
        const estimatedTime = this._estimateTimeService.estimateTime(course.id);

        return {
            estimatedTime,
            ...pick(course, ["id", "length", "path"]),
        };
    }

}

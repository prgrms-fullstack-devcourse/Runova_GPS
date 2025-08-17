import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Course } from "../model";
import { In, Repository } from "typeorm";
import { CourseDTO, GetCoursesDTO } from "../dto";
import { pick } from "../../utils/object";
import { EstimateTimeService } from "./estimate.time.service";
import { Coordinates, toLineString } from "../../common/geo";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class CoursesService {
    private readonly _tol: number;

    constructor(
        @InjectRepository(Course)
        private readonly _coursesRepo: Repository<Course>,
        @Inject(EstimateTimeService)
        private readonly _estimateTimeService: EstimateTimeService,
        @Inject(ConfigService)
        config: ConfigService,
    ) {
        this._tol = config.get<number>(
            "GIS_SIMPLIFY_TOL"
        ) ?? 0.000008;
    }


    async createCourse(userId: number, path: Coordinates[]): Promise<CourseDTO> {

        const { raw } = await this._coursesRepo
            .createQueryBuilder("course")
            .insert()
            .into(Course)
            .values({
                userId,
                path: () => `
                ST_Simplify(ST_GeomFromGeoJSON(:line), :tol)
                `
            })
            .setParameters({
                userId,
                line: toLineString(path),
                tol: this._tol
            })
            .updateEntity(false)
            .returning(["id", "path", "length"])
            .execute();

        const vals: Omit<CourseDTO, "estimatedTime"> = raw[0];
        const estimatedTime = this._estimateTimeService.estimateTime(vals.length);
        return Object.assign(vals, { estimatedTime });
    }

    async getCourses(dto: GetCoursesDTO): Promise<CourseDTO[]> {
        const { ids, userId } = dto;

        const courses = await this._coursesRepo.findBy({
            id: ids?.length && In(ids),
            userId,
        });

        return courses.map(c => this.toCourseDTO(c));
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

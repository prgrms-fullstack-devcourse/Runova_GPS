import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Course } from "../model";
import { In, Repository } from "typeorm";
import { CourseDTO, GetCoursesDTO } from "../dto";
import { pick } from "../../utils/object";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class CoursesService {
    private readonly _tolerance: number;

    constructor(
        @InjectRepository(Course)
        private readonly _coursesRepo: Repository<Course>,
        @Inject(ConfigService)
        config: ConfigService,
    ) {

    }

    async createCourse(userId: number, path: [number, number][]): Promise<void> {
        await this._coursesRepo.save({ userId, path });
    }

    async getCourse(id: number): Promise<CourseDTO> {

        const course = await this._coursesRepo.findOne({
            where: { id },
            cache: true,
        });

        if (!course) throw new NotFoundException();
        return pick(course, ["id", "length", "path"]);
    }

    async getCourses(dto: GetCoursesDTO): Promise<CourseDTO[]> {
        const { ids, userId } = dto;

        const courses = await this._coursesRepo.findBy({
            id: ids?.length && In(ids),
            userId,
        });

        return courses.map(c => pick(c, ["id", "length", "path"]));
    }

    async isContained(id: number, pos: [number, number]): Promise<boolean> {

        const result = await this._coursesRepo
            .createQueryBuilder("course")
            .select(
                `ST_Contain(
                course.path,
                ST_setSRID(ST_MakePoint(:lon, :lat), 4326)
                )`,
                "contained"
            )
            .where("contained.id = :id")
            .setParameters({ id, lon: pos[0], lat: pos[1] })
            .getRawOne<{ contained: boolean; }>();

        if (!result) throw new NotFoundException();
        return result.contained;
    }

}

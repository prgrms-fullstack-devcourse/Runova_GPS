import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { RunningCourse } from "../model";
import { In, Repository } from "typeorm";
import { RunningCourseDTO, GetCoursesDTO } from "../dto";
import { pick } from "../../utils/object";
import { ConfigService } from "@nestjs/config";
import { Coordinates } from "../../common/geo";
import { expectTimeToBeTaken } from "./service.internal";

@Injectable()
export class RunningCoursesService {
    private readonly _tolerance: number;
    private readonly _meanSpeed: number;

    constructor(
        @InjectRepository(RunningCourse)
        private readonly _coursesRepo: Repository<RunningCourse>,
        @Inject(ConfigService)
        config: ConfigService,
    ) {
        this._tolerance = config.get<number>(
            "COURSE_TOLERANCE",
        ) ?? 0.5;

        this._meanSpeed = config.get<number>(
            "RUNNER_MEAN_SPEED"
        ) ?? 7;
    }

    async createCourse(userId: number, path: Coordinates[]): Promise<void> {
        await this._coursesRepo.save({ userId, path });
    }

    async getCourses(dto: GetCoursesDTO): Promise<RunningCourseDTO[]> {
        const { ids, userId } = dto;

        const courses = await this._coursesRepo.findBy({
            id: ids?.length && In(ids),
            userId,
        });

        return courses.map(c => ({
            ...pick(c, ["id", "length", "path"]),
            takenTimeExpectation: expectTimeToBeTaken(
                c.length,
                this._meanSpeed
            )
        }));
    }


}

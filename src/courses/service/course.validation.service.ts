import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Course } from "../model";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { Coordinates } from "../../common/geo";

@Injectable()
export class CourseValidationService {
    private readonly _tolerance: number;

    constructor(
       @InjectRepository(Course)
       private readonly _coursesRepo: Repository<Course>,
       @Inject(ConfigService)
       config: ConfigService,
    ) {
        this._tolerance = config.get<number>(
            "COURSE_TOLERANCE"
        ) ?? 0.5;
    }

    async canStart(id: number, location: Coordinates): Promise<boolean> {

        const raw = await this._coursesRepo
            .createQueryBuilder("course")
            .select(
                `
                ST_DistanceSphere(
                ST_StartPoint(course.path),
                ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)
                )
                `,
                "distance"
            )
            .where("course.id = :id")
            .setParameters({ id, ...location })
            .getRawOne<{ distance: number; }>();

        if (!raw) throw new NotFoundException();
        return raw.distance < this._tolerance;
    }

    async getProgress(id: number, location: Coordinates): Promise<number> {

        const raw = await this._coursesRepo
            .createQueryBuilder("course")
            .select(
                `ST_LineLocatePoint(
                course.path,
                ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)
                )`,
                "p"
            )
            .addSelect("course.length", "length")
            .where("course.id = :id")
            .setParameters({ id, ...location })
            .getRawOne<{ p: number; length: number; }>();

        if (!raw) throw new NotFoundException();
        return raw.p * raw.length;
    }


}
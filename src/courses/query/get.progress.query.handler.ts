import { InjectRepository } from "@nestjs/typeorm";
import { Course } from "../model";
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { Coordinates } from "../../common/geo";
import { GetProgressQueryResult } from "./get.progress.query.result";
import { plainToInstanceOrReject } from "../../utils";

@Injectable()
export class GetProgressQueryHandler {

    constructor(
        @InjectRepository(Course)
        private readonly _coursesRepo: Repository<Course>,
    ) {}

    async execute(id: number, location: Coordinates): Promise<GetProgressQueryResult | null> {

        const raw = await this._coursesRepo
            .createQueryBuilder("course")
            .select("course.length * p.frac", "progress")
            .addSelect(
                `ST_DistanceSphere(o.geom::geometry, c.closest::geometry)`,
                "epsilon"
            )
            .addSelect(
                `ST_Azimuth(o.geom::geometry, c.closest::geometry)`,
                "theta"
            )
            .innerJoin(
                `LATERAL (
                SELECT ST_SetSRID(ST_MakePoint(:lon, :lat), 4326) AS geom
                )`,
                "o"
            )
            .innerJoin(
                `LATERAL (
                SELECT ST_LineLocatePoint(course.path, o.geom) AS frac
                )`,
                "p"
            )
            .innerJoin(
                `LATERAL (
                ST_LineInterpolatePoint(course.path, frac) AS closest
                )`,
                "c"
            )
            .where("course.id = :id")
            .setParameters({ id, ...location })
            .getRawOne();

        return raw
            ? plainToInstanceOrReject(GetProgressQueryResult, raw)
            : null;
    }

}


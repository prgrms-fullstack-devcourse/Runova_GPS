import { Injectable } from "@nestjs/common";
import { Repository, SelectQueryBuilder } from "typeorm";
import { GetEdgesQueryResult } from "./get.edges.query.result";
import { InjectRepository } from "@nestjs/typeorm";
import { Course } from "../model";
import { plainToInstanceOrReject } from "../../utils";

@Injectable()
export class GetEdgesQueryHandler {

    constructor(
        @InjectRepository(Course)
        private readonly _coursesRepo: Repository<Course>,
    ) {}

    async execute(id: number): Promise<GetEdgesQueryResult | null> {

        const qb = this._coursesRepo
            .createQueryBuilder("course")
            .select(
                `
                jsonb_agg(
                jsonb_build_object(
                "geo", ds.geo,
                "length", ds.length,
                "bearing", ds.bearing
                )
                )
                `,
                "edges"
            );

        const raw = await qb
            .innerJoin(
                `LATERAL(${__makeSelectDumpSegmentsQuery(qb)})`,
                "ds"
            )
            .where("course.id = :id", { id })
            .groupBy("course.id")
            .getRawOne();


        return raw
            ? await plainToInstanceOrReject(GetEdgesQueryResult, raw)
            : null;
    }
}

function __makeSelectDumpSegmentsQuery(
    qb: SelectQueryBuilder<Course>
): string {
    return qb
        .subQuery()
        .select(
            `ST_GeoHash(ST_StartPoint(ds.geom))`,
            "geo"
        )
        .addSelect(
            `ST_Length(ST_Transform(ds.geom, 5179))`,
            "length"
        )
        .addSelect(
            `ST_Azimuth(ST_StartPoint(geom), ST_EndPoint(geom))`,
            "bearing"
        )
        .from(`ST_DumpSegments(course.path)`, "ds")
        .getQuery();
}


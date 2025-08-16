import { Injectable } from "@nestjs/common";
import { Repository, SelectQueryBuilder } from "typeorm";
import { GetSegmentsQueryResult } from "./get.segments.query.result";
import { InjectRepository } from "@nestjs/typeorm";
import { Course } from "../model";
import { SelectDumpPoints } from "../../common/geo";
import { plainToInstanceOrReject } from "../../utils";

@Injectable()
export class GetSegmentsQueryHandler {

    constructor(
        @InjectRepository(Course)
        private readonly _coursesRepo: Repository<Course>,
    ) {}

    async execute(id: number): Promise<GetSegmentsQueryResult | null> {

        const raw = await this._coursesRepo
            .createQueryBuilder("course")
            .innerJoin(
                SelectDumpPoints("course.path", "pos"),
                "dp"
            )
            .innerJoin(
                __selectDumpSegments,
                "ds"
            )
            .select("dp.pos", "pos")
            .addSelect("ds.len", "len")
            .addSelect("ds.deg", "deg")
            .where("course.id = :id", { id })
            .getRawOne();

        return raw
            ? await plainToInstanceOrReject(GetSegmentsQueryResult, raw)
            : null;
    }
}

function __selectDumpSegments(
    qb: SelectQueryBuilder<any>
): SelectQueryBuilder<any> {
    return qb
        .select(
            `array_prepend(
                0::double precision,
                array_agg(ds.len)
                )`,
            "len"
        )
        .addSelect(
            `array_append(
                array_agg(ds.deg),
                0::double precision
                )`,
            "deg"
        )
        .from(__fromClause, "ds");
}

function __fromClause(qb: SelectQueryBuilder<any>): SelectQueryBuilder<any> {
    return qb
        .select(
            `SUM(ST_Length(ST_Transform(ds.geom, 32652))) OVER (ORDER BY ds.path[1])`,
            "len"
        )
        .addSelect(
            `ST_Azimuth(ST_StartPoint(ds.geom), ST_EndPoint(ds.geom))`,
            "deg"
        )
        .from(
            `ST_DumpSegments(course.path)`,
            "ds"
        );
}
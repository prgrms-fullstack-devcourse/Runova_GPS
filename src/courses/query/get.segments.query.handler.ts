import { Injectable } from "@nestjs/common";
import { Repository, SelectQueryBuilder } from "typeorm";
import { GetSegmentsQueryResult } from "./get.segments.query.result";
import { InjectRepository } from "@nestjs/typeorm";
import { Course } from "../model";
import { makeSelectDumpPoints } from "../../common/geo";
import { plainToInstanceOrReject } from "../../utils";

@Injectable()
export class GetSegmentsQueryHandler {

    constructor(
        @InjectRepository(Course)
        private readonly _coursesRepo: Repository<Course>,
    ) {}

    async execute(id: number): Promise<GetSegmentsQueryResult | null> {

        const qb = this._coursesRepo
            .createQueryBuilder("course")
            .select("dp.pos", "pos")
            .addSelect("ds.len", "len")
            .addSelect("ds.deg", "deg");

        const raw = await qb
            .innerJoin(
                makeSelectDumpPoints("course.path", "pos"),
                "dp"
            )
            .innerJoin(
                __makeSelectDumpSegmentsQuery(qb),
                "ds"
            )
            .where("course.id > :id", { id })
            .getRawOne();


        return raw
            ? await plainToInstanceOrReject(GetSegmentsQueryResult, raw)
            : null;
    }
}

function __makeSelectDumpSegmentsQuery(
    qb: SelectQueryBuilder<Course>
): string {

    const sql = qb.subQuery()
        .select(
            `
             array_prepend(
                        0::double precision,
                        array_agg(ds.len)
             )
            `,
            "len"
        )
        .addSelect(
            `
            array_append(
                        array_agg(ds.deg),
                        0::double precision
            )
            `,
            "deg"
        )
        .from(__fromClause, "ds")
        .getQuery();

    return `LATERAL(${sql})`;
}


function __fromClause(qb: SelectQueryBuilder<Course>): SelectQueryBuilder<Course> {
    return qb
        .select(
            `SUM(ST_Length(ST_Transform(geom, 32652))) OVER (ORDER BY path[1])`,
            "len"
        )
        .addSelect(
            `ST_Azimuth(ST_StartPoint(geom), ST_EndPoint(geom))`,
            "deg"
        );
}
import { SelectQueryBuilder } from "typeorm";
import { makeSelectSegmentQuery } from "../../common/geo/internal";

export function SelectSegments(
    tableAlias: string,
    prop: string,
) {
    const alias = `"${tableAlias}"."${prop}"`;

    return (qb: SelectQueryBuilder<any>) => qb.subQuery()
        .select(
            `jsonb_agg(
            ${makeSelectSegmentQuery("ds.geom")}
            )`
        )
        .from(
            `ST_DumpSegments(${alias})`,
            "ds"
        );
}


function __makeSelectSegmentQuery(tg: string): string {
    return `jsonb_build_object(
    'length', ST_Length(${tg}),
    'begin', ${__makeSelectCoordinatesQuery(`ST_StartPoint(${tg})`)},
    'end', ${__makeSelectCoordinatesQuery(`ST_EndPoint(${tg})`)}
    )`;
}

function __makeSelectCoordinatesQuery(tg: string): string {
    return `jsonb_build_object(
    'lat', ST_Y(${tg}), 
    'lon', ST_X(${tg})
    )`;
}


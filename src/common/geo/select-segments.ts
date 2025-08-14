import { SelectQueryBuilder } from "typeorm";
import { makeSelectSegmentQuery } from "./internal";

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
import { SelectQueryBuilder } from "typeorm";
import { makeSelectCoordinatesQuery } from "./internal";

export function SelectPath(
    tableAlias: string,
    prop: string,
) {
    const alias = `"${tableAlias}"."${prop}"`;

    return (qb: SelectQueryBuilder<any>) => qb.subQuery()
        .select(
            `jsonb_agg(
            ${makeSelectCoordinatesQuery("dp.geom")}
            )`
        )
        .from(`ST_DumpPoints(${alias})`, "dp");
}
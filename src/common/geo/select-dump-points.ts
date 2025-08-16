import { SelectQueryBuilder } from "typeorm";
import { makeSelectCoordinatesQuery } from "./make-select-coordinates-query";

export function SelectDumpPoints(
    tg: string,
    geomAlias?: string
) {
    return (qb: SelectQueryBuilder<any>): SelectQueryBuilder<any> => qb
        .select(
            `jsonb_agg(
            ${makeSelectCoordinatesQuery("ds.geom")}
            )`,
            geomAlias ?? "path"
        )
        .from(`ST_DumpPoints(${tg})`, "dp");
}
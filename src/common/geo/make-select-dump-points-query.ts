import { makeSelectCoordinatesQuery } from "./make-select-coordinates-query";

export function makeSelectDumpPoints(
    tg: string,
    geomAlias?: string,
): string {
    return `
    LATERAL(
        SELECT
            jsonb_agg(
                ${makeSelectCoordinatesQuery(tg)}
            ) AS ${geomAlias ?? "path"},
        FROM ST_DumpPoints(ST_Force2D(course.path))
    )
    `;
}
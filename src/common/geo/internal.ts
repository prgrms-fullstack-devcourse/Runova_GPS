export function makeSelectCoordinatesQuery(tg: string): string {
    return `jsonb_build_object(
    'lat', ST_Y(${tg}), 
    'lon', ST_X(${tg})
    )`;
}

export function makeSelectSegmentQuery(tg: string): string {
    return `jsonb_build_object(
    'length', ST_Length(${tg}),
    'begin', ${makeSelectCoordinatesQuery(`ST_StartPoint(${tg})`)},
    'end', ${makeSelectCoordinatesQuery(`ST_EndPoint(${tg})`)}
    )`;
}
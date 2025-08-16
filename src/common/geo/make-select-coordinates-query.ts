export function makeSelectCoordinatesQuery(tg: string): string {
    return `jsonb_build_object(
    'lat', ST_Y(${tg}), 
    'lon', ST_X(${tg})
    )`;
}


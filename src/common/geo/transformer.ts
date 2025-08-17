import { Coordinates } from "./coordinates";
import { LineString } from "geojson";

export function toLineString(path: Coordinates[]): LineString {
    const coordinates = path.map(({ lon, lat }) => [lon, lat]);
    return { type: "LineString", coordinates };
}

export function fromLineString(line: LineString): Coordinates[] {
    return line.coordinates
        .map(([lon, lat]) =>
            new Coordinates({ lon, lat })
        );
}
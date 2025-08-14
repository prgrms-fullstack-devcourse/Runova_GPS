import { Column, ColumnOptions, ValueTransformer } from "typeorm";
import { LineString } from "geojson";
import { Coordinates } from "./coordinates";

const __transformer: ValueTransformer = {
    from(line: LineString): Coordinates[] {
        return line.coordinates
            .map(([lon, lat]) =>
                new Coordinates({ lon, lat }),
            );
    },
    to(path: Coordinates[]): LineString {
        const coordinates = path.map(p => [p.lon, p.lat]);
        return { type: "LineString", coordinates };
    }
}

export type GeometricColumnOptions
    = Omit<ColumnOptions, "type" | "spatialFeatureType" | "srid" | "transformer">;

export function GeometricColumn(options?: GeometricColumnOptions): PropertyDecorator {

    const opts: ColumnOptions = {
        type: "geometry",
        spatialFeatureType: "LineString",
        precision: 12,
        srid: 4326,
        transformer: __transformer
    };

    options && Object.assign(opts, options);
    return Column(opts);
}
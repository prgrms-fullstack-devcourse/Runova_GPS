import { Column, ColumnOptions } from "typeorm";
import { fromLineString, toLineString } from "./transformer";


export type GeometricColumnOptions
    = Omit<ColumnOptions, "type" | "spatialFeatureType" | "srid" | "transformer">;

export function GeometricColumn(options?: GeometricColumnOptions): PropertyDecorator {

    const opts: ColumnOptions = {
        type: "geometry",
        spatialFeatureType: "LineString",
        precision: 6,
        srid: 4326,
        transformer: {
            from: fromLineString,
            to: toLineString
        },
    };

    options && Object.assign(opts, options);
    return Column(opts);
}
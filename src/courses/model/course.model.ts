import { ModelBase } from "../../common/model";
import { Column, Entity, PrimaryGeneratedColumn, ValueTransformer } from "typeorm";
import { LineString } from "geojson";

const __transformer: ValueTransformer = {
    from(line: LineString): [number, number][] {
        return line.coordinates as [number, number][];
    },
    to(path: [number, number][]): LineString {
        return { type: "LineString", coordinates: path };
    }
};

@Entity("courses")
export class Course extends ModelBase {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "user_id", type: "integer" })
    userId: number;

    @Column({ type: "double precision"  })
    length: number;

    @Column({
        type: "geometry",
        spatialFeatureType: "LineString",
        srid: 4326,
        precision: 12,
        transformer: __transformer,
    })
    path: [number, number][];
}
import { ModelBase } from "../../common/model";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Coordinates, GeometricColumn } from "../../common/geo";


@Entity("running_courses")
export class RunningCourse extends ModelBase {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "user_id", type: "integer" })
    userId: number;

    @Column({ type: "double precision"  })
    length: number;

    @GeometricColumn()
    path: Coordinates[];
}
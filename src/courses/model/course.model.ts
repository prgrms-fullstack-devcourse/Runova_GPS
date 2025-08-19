import { ModelBase } from "../../common/model";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Coordinates, GeometricColumn } from "../../common/geo";

@Entity("courses")
export class Course extends ModelBase {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "user_id", type: "integer" })
    userId: number;

    @Column({ type: "float8"  })
    length: number;
    
    @Column({ name: "time_required", type: "varchar" })
    timeRequired: string;

    @GeometricColumn()
    path: Coordinates[];
}
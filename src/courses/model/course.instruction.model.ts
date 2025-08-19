import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ModelBase } from "../../common/model";

@Entity()
export class CourseInstruction extends ModelBase {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ name: "course_id", type: "integer" })
    courseId: number;

    @Column({ type: "varchar" })
    geo: string;

    @Column({ type: "varchar" })
    text: string;
}
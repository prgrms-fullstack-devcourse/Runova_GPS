import { IsInt, IsNumber, ValidateNested } from "class-validator";
import { Transform, Type } from "class-transformer";
import { Coordinates, fromLineString } from "../../common/geo";
import { Logger } from "@nestjs/common";

export class CoursePreview {
    @ValidateNested({ each: true })
    @Type(() => Coordinates)
    @Transform(({ value }) => {
        try {
            return fromLineString(
                typeof value === 'string'
                    ? JSON.parse(value)
                    : value
            );
        }
        catch (err) {
            Logger.log(err, "CoursePreview");
            return null;
        }
    })
    path: Coordinates[];

    @IsNumber()
    length: number;

    @IsInt()
    time: number;
}
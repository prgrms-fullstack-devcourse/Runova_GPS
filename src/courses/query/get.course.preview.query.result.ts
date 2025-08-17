import { IsNumber, ValidateNested } from "class-validator";
import { Coordinates, fromLineString } from "../../common/geo";
import { Transform, Type } from "class-transformer";
import { Logger } from "@nestjs/common";

export class GetCoursePreviewQueryResult {

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
         Logger.error(err, "GetCoursePreviewQueryResult");
         return null;
      }
   })
   path: Coordinates[];
   @IsNumber()
   length: number;
   @IsNumber()
   time: number;
}
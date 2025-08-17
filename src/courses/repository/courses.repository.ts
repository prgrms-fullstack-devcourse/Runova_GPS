import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Coordinates } from "../../common/geo";
import { Course } from "../model";

@Injectable()
export class CoursesRepository {

    constructor(
      @InjectRepository(Course)
      private readonly _repo: Repository<Course>,
    ) {}

    async save(userId: number, path: Coordinates[]) {

    }

}
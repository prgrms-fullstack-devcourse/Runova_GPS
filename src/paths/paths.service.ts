import { Inject, Injectable } from '@nestjs/common';
import { PG_CLIENT } from "../config/pg";
import { Client } from "pg";

@Injectable()
export class PathsService {

    constructor(
       @Inject(PG_CLIENT)
       private readonly _pg: Client,
    ) {}

    async getState(id: number, pos: [number, number]) {

    }

}

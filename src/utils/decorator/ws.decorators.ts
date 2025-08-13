import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Socket } from "socket.io";

export function ParamDecorator(prop: string) {
    return createParamDecorator((data: string, ctx: ExecutionContext) => {
       let tg: Socket = ctx.switchToWs().getClient();

       for (const p of prop.split('.')) {
           if (!tg[p]) break;
           tg = tg[p];
       }

       return data ? tg?.[data] : tg;
    });
}

export const WSQuery = ParamDecorator("handshake.query");
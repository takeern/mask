import { Injectable, CanActivate, ExecutionContext, HttpException } from '@nestjs/common';
import { Observable } from 'rxjs';

import { LogService } from '../services/log.service';
import { UserService } from '../services/user.service';
const ipCheck = require('../../config/ipCheck.json');

@Injectable()
export class adminGuard implements CanActivate {
    constructor(
        private readonly logService: LogService,
        private readonly userService: UserService
    ) {}

    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {
        const req = context.switchToHttp().getRequest();
        const clientIp = req.ip;
        this.logService.debug(clientIp);
        if (ipCheck.whiteIp.length !== 0) {
            const isCheck = ipCheck.whiteIp.find(item => {
                return clientIp.indexOf(item) !== -1;
            })
            if (isCheck) {
                return true;
            }
            return false;
        } else if (ipCheck.blackIp.length !== 0) {
            const isCheck = ipCheck.blackIp.find(item => {
                return clientIp.indexOf(item) !== -1;
            });
            if (isCheck) {
                return false;
            }
            return true;
        }
        return true;
    }
}
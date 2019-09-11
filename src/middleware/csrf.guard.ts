import { Injectable, CanActivate, ExecutionContext, HttpException } from '@nestjs/common';
import { Observable } from 'rxjs';

import { LogService } from '../services/log.service';
import { UserService } from '../services/user.service';

@Injectable()
export class CsrfGuard implements CanActivate {
    constructor(
        private readonly logService: LogService,
        private readonly userService: UserService
    ) {}

    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {
        const req = context.switchToHttp().getRequest();
        const res = context.switchToHttp().getResponse();
        const { token } = req.cookies;

        if (token && req.method === 'POST') {
            const checkAuth = req.body['csrf_token'];
            if (token !== checkAuth) {
                throw new HttpException({
                    code: 10004,
                    msg: 'CSRF is illegal',
                }, 200);
            } else {
                const user = await this.userService.search({
                    token,
                });
                req.body.uid = user.id;
            }
        } else {
            throw new HttpException({
                code: 10005,
                msg: 'Not logged in',
            }, 200);
        }
        
        return true;
    }
}
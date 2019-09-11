import { NestMiddleware } from '@nestjs/common';
import { Injectable } from '@nestjs/common';

import { LogService } from '../services/log.service';
import { UserService } from '../services/user.service';

@Injectable()
export class CsrfMiddleware implements NestMiddleware {
    constructor(
        private readonly logService: LogService,
        private readonly userService: UserService
    ) {}

    resolve(): (req, res, next) => void {
        return async (req, res, next) => {
            this.logService.debug('CsrfMiddleware');
            
            const { token } = req.cookies;
            this.logService.debug(req.body);
            if (token && req.method === 'POST') {
                const checkAuth = req.body['x-csrf-token'];
                this.logService.debug(checkAuth);
                if (token !== checkAuth) {
                    return res.send({
                        code: 10004,
                        msg: 'CSRF is illegal',
                    });
                } else {
                    const user = await this.userService.search({
                        token,
                    });
                    req.headers.uid = user.id;
                    req.body.uid = user.id;
                }
            } else {
                return {
                    code: 10005,
                    msg: 'Not logged in',
                };
            }
            this.logService.debug(req.body);
            next();
        }
    }
}
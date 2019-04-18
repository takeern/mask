import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
const ipCheck = require('../../config/ipCheck.json');

@Injectable()
export class UploadGuard implements CanActivate {
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest();
        const clientIp = req.ip;
        if (ipCheck.whiteIp.length !== 0) {
            const isCheck = ipCheck.whiteIp.find(item => {
                return clientIp.indexOf(item) !== -1;
            })
            if (isCheck) {
                return true;
            }
            console.log('black');
            return false;
        } else if (ipCheck.blackIp.length !== 0) {
            const isCheck = ipCheck.blackIp.find(item => {
                return clientIp.indexOf(item) !== -1;
            })
            if (isCheck) {
                console.log('black');
                return false;
            }
            return true;
        }
        return true;
    }
}
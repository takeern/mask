import { Injectable, UseInterceptors } from '@nestjs/common';
import { LogService } from '../services/log.service';

@Injectable()
export class UploadService {
    constructor(
        private readonly logService: LogService
    ) {
        this.logService = logService;
    }
    upload(bs) {
        
    }
}

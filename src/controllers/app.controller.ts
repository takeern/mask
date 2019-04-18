import { Controller, UseGuards, Post, Body, FileInterceptor, UploadedFile, UseInterceptors } from '@nestjs/common';
import { SpiderService } from '../services/spider.service';
import { RedisService } from '../services/redis.service';
import { SpiderOrigin } from '../interface/CONFIG.STATE';
import { diskStorage } from 'multer'
import { UploadGuard } from '../guards/upload.guard';

interface Iconfig {
	bookName?: string;
	bookNumber?: string;
	bookHref?: string;
}

@Controller()
export class AppController {
    constructor(
        private readonly appService: SpiderService,
        private readonly redisService: RedisService
        ) {}
    
    static getFileType (mimeType: string): string {
        let fileType: string;
        if (mimeType.match(/image/)) {
            fileType = 'img';
        } else if (mimeType.match(/pdf/)) {
            fileType = 'pdf';
        } else if (mimeType.match(/mp3/)) {
            fileType = 'mp3';
        } else {
            fileType = 'all';
        };
        return fileType;
    };

    @Post('upload')
    @UseGuards(UploadGuard)
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination:(req, file, cb) => {
                const { mimetype } = file;
                const fileType = AppController.getFileType(mimetype);
                cb(null, `../file/${fileType}`);
            },
            filename: (req, file, cb) => {
              // Generating a 32 random chars long string
              cb(null, `${(file.originalname)}`)
            }
          })
    }))
    upload(@UploadedFile() file, @Body() bd) {
        const fileType = AppController.getFileType(file.mimetype);
        console.log('upload')
        return {
            code: 1,
            path: `/${fileType}/${(file.originalname)}`,
        }
    }
}

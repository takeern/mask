import { Controller, UseGuards, Post, Body, FileInterceptor, UploadedFile, UseInterceptors } from '@nestjs/common';
import { LogService } from '../services/log.service';
import { UploadGuard } from '../middleware/upload.guard';
const { exec, cwd } = require('child_process');
const fs = require('fs');

interface Iconfig {
	bookName?: string;
	bookNumber?: string;
	bookHref?: string;
}

@Controller()
export class AppController {
    private journalMap = {
        JISSR: {
            path: '/home/quicklyReactSsr/parsePage',
            pdfPath: '/home/quicklyReactSsr/src/assets/pdf'
        },
        IJPEE: {
            path: '/home/journal1/parsePage',
            pdfPath: '/home/journal1/src/assets/pdf'
        },
        bryanhousepub: {
            path: '/home/iss2/parsePage',
            pdfPath: '/home/iss2/src/static/pdf'
        },
    }
    constructor(
        private readonly logService: LogService
        ) {}
    
    static getFileType (mimeType: string): string {
        let fileType: string;
        if (mimeType.match(/image/)) {
            fileType = 'img';
        } else if (mimeType.match(/pdf/)) {
            fileType = 'pdf';
        } else if (mimeType.match(/mp3/)) {
            fileType = 'mp3';
        } else if (mimeType.match(/text/)) {
            fileType = 'txt'
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
        }),
    }))
    upload(@UploadedFile() file, @Body() bd) {
        const { } = bd;
    }

    @Post('uploadInfo')
    async getUploadInfo(@Body() bd) {
        
    }
}

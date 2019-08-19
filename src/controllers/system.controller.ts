import { Controller, UseGuards, Post, Body, FileInterceptor, UploadedFile, UseInterceptors } from '@nestjs/common';
import { LogService } from '../services/log.service';
import { JournalService }  from '../services/user.service';
import { AuthService }  from '../services/auth.service';
import { Journal } from '../static/entity/journal.entity';
import { UploadGuard } from '../middleware/upload.guard';
import { JournalSubmit } from '../static/dto/journal.dto';
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
        private readonly logService: LogService,
        private readonly journalService: JournalService
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
                cb(null, `../files}`);	
            },	
            filename: (req, file, cb) => {
              cb(null, `${file.originalname}|${Date.now()}`)	
            }	
        }),
    }))
    upload(@UploadedFile() file, @Body() bd: JournalSubmit) {
        
        this.logger.info(file);
    }

    @Post('uploadInfo')
    async getUploadInfo(@Body() bd) {
        
    }
}

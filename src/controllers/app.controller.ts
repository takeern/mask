import { Controller, UseGuards, Post, Body, FileInterceptor, UploadedFile, UseInterceptors } from '@nestjs/common';
import { LogService } from '../services/log.service';
import { UploadGuard } from '../guards/upload.guard';
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
        IJOMSR: {
            path: '/home/pink/parsePage',
            pdfPath: '/home/pink/src/static/pdf'
        },
        JSSHL: {
            path: '/home/jsshl/parsePage',
            pdfPath: '/home/jsshl/src/static/pdf'
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
        console.log(mimeType);
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
    @UseInterceptors(FileInterceptor('file'))
    upload(@UploadedFile() file, @Body() bd) {
        const fileType = AppController.getFileType(file.mimetype);
        const { journalType } = bd;
        const journal = this.journalMap[journalType];
        if (!journal) {
            return {
                code: 2,
                msg: 'unhandle journal',
            }
        }
        let setPath;
        if (fileType === 'txt') {
            setPath = `${journal.path}/${file.originalname}`
        } else if (fileType === 'pdf') {
            setPath = `${journal.pdfPath}/${file.originalname}`
        } else {
            return {
                code: 2,
                msg: '不支持的文件类型',
            }
        }
        fs.writeFile(`${setPath}`, file.buffer, () => {
            if (fileType === 'txt' || journalType === 'IJOMSR' || journalType === 'JSSHL') {
                exec(`node test.js`, {
                    cwd: `${journal.path}`,
                }, function (error, stdout, stderr) {
                    if (error) {
                        console.log(error);
                    }
                });
            }
            this.logService.info(`${setPath}`);
        });

        return {
            code: 1,
            path: `${setPath}`,
        }
    }
}

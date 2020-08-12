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
            pdfPath: '/home/quicklyReactSsr/src/assets/pdf',
            filePath: '/home/quicklyReactSsr/dist',
        },
        IJPEE: {
            path: '/home/journal1/parsePage',
            pdfPath: '/home/journal1/src/assets/pdf',
            filePath: '/home/journal1/dist',
        },
        IJOMSR: {
            path: '/home/pink/parsePage',
            pdfPath: '/home/pink/src/static/pdf',
            filePath: '/home/pink/dist',
        },
        JSSHL: {
            path: '/home/jsshl/parsePage',
            pdfPath: '/home/jsshl/src/static/pdf',
            filePath: '/home/jsshl/dist',
        },
        WJIMT: {
            path: '/home/wjimt/parsePage',
            pdfPath: '/home/wjimt/src/static/pdf',
            filePath: '/home/wjimt/dist',
        },
        bryanhousepub: {
            path: '/home/iss2/parsePage',
            pdfPath: '/home/iss2/src/static/pdf',
            filePath: '/home/iss2/dist',
        },
        ISS3: {
            path: '/home/iss3/parsePage',
            pdfPath: '/home/iss3/src/static/pdf',
            filePath: '/home/iss3/dist',
        },
        JSSPP: {
            path: '/home/jsspp/parsePage',
            pdfPath: '/home/jsspp/src/assets/pdf',
            filePath: '/home/jsspp/dist',
        },
        JTIEM: {
            path: '/home/jtiem/parsePage',
            pdfPath: '/home/jtiem/src/assets/pdf',
            filePath: '/home/jtiem/dist',
        },
        JOSTR: {
            path: '/home/jostr/parsePage',
            pdfPath: '/home/jostr/src/assets/pdf',
            filePath: '/home/jostr/dist',
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
        const { journalType, uploadType } = bd;
        const journal = this.journalMap[journalType];
        if (!journal) {
            return {
                code: 2,
                msg: 'unhandle journal',
            }
        }
        let setPath;
        if (uploadType === 'version') {
            setPath = `${journal.filePath}/${file.originalname}`
            fs.writeFile(`${setPath}`, file.buffer, () => {
                this.logService.info(`${setPath}`);
            });
    
        } else if (uploadType === 'pdf') {
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
                if (fileType === 'txt' || journalType === 'IJOMSR' || journalType === 'JSSHL' || journalType === 'WJIMT') {
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
        }
        return {
            code: 1,
            path: `${setPath}`,
        }
    }
}

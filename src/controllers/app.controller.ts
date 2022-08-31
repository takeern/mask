import { Controller, UseGuards, Post, Body, FileInterceptor, UploadedFile, UseInterceptors, Request } from '@nestjs/common';
import { LogService } from '../services/log.service';
import { UploadGuard } from '../guards/upload.guard';
import { JournalService } from '../services/journal.service';
import { Journal } from '../static/entity/journal.entity';
const { exec, cwd } = require('child_process');
const fs = require('fs');
const iconv = require('iconv-lite');

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
        JTPCE: {
            path: '/home/jtpce/parsePage',
            pdfPath: '/home/jtpce/src/assets/pdf',
            filePath: '/home/jtpce/dist',
        },
        JTPSS: {
            path: '/home/jtpss/parsePage',
            pdfPath: '/home/jtpss/src/assets/pdf',
            filePath: '/home/jtpss/dist',
        },
        JTPMS: {
            path: '/home/jtpms/parsePage',
            pdfPath: '/home/jtpms/src/assets/pdf',
            filePath: '/home/jtpms/dist',
        },
        JTPES: {
            path: '/home/jtpes/parsePage',
            pdfPath: '/home/jtpes/src/assets/pdf',
            filePath: '/home/jtpes/dist',
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

    private parseTxt(data: string) {
        const removeNO = function (item) {
            return !!(item.trim());
        };
        const arr = [];
        const list = data.split(/(\r\n)+/).filter(removeNO);
        for(let i = 0, len = list.length/2; i < len; i ++) {
            arr.push({
                title: list[i * 2],
                name: list[i * 2 + 1],
            });
        }
        return arr;
    }

    private getFileEncodeType(buffer: Buffer) {
        if (buffer[0]==0xff&&buffer[1]==0xfe) {
            return ('unicode')
        } else if (buffer[0]==0xfe&&buffer[1]==0xff) {
        　　return ('unicode')
        } else if(buffer[0]==0xef&&buffer[1]==0xbb) {
    　　　  return ('utf-8')
        } else {
       // 　　return ('gbk')
	return ('utf-8');
        }
    }

    private parseBuffer(buffer: Buffer) {
        const type = this.getFileEncodeType(buffer);
        const data = iconv.decode(buffer, type);
        return data;
    }

    private parseName(data: string) {
        const res = data.match(/(\w{4})?-?(\d{4}-\d{1,2}-\d{1,2})_?(\d{1,2})?.[pdf|txt]/i);
        if (res && res.length) {
            return {
                type: res[1],
                time: res[2],
                index: res[3],
            }
        }

        this.logService.error(`parsePdfName error, name: ${data}`);
        return null;
    }

    private changePathToDev(path: string) {
        return path.replace('home', 'home/dev');
    }

    @Post('upload')
    @UseGuards(UploadGuard)
    @UseInterceptors(FileInterceptor('file'))
    async upload(@UploadedFile() file, @Body() bd, @Request() req) {
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
        let journals;
        if (uploadType === 'version') {
            setPath = `${journal.filePath}/${file.originalname}`
            fs.writeFile(`${setPath}`, file.buffer, () => {
                this.logService.info(`${setPath}`);
            });
    
        } else if (uploadType === 'pdf') {
            if (fileType === 'txt') {
                setPath = `${journal.path}/${file.originalname}`;
                journals = this.parseTxt(this.parseBuffer(file.buffer));
                const info = this.parseName(file.originalname);
                for (let index = 0; index < journals.length; index++) {
                    this.logService.info(`save journal`);
                    const item = journals[index];
                    let j = new Journal();
                    j.journalTime = info.time;
                    j.journalType = info.type || journalType;
                    j.journalId = index + 1;
                    
                    j = await this.journalService.find(j) || j;

                    j.artTitle = item.title;
                    j.userName = item.name;
                    j.ip = req.ip;
                    this.logService.info(j);
                    await this.journalService.save(j);
                }
            } else if (fileType === 'pdf') {
                setPath = `${journal.pdfPath}/${file.originalname}`
                const info = this.parseName(file.originalname);
                if (info) {
                    let j = new Journal();
                    this.logService.info(info);
                    j.journalTime = info.time;
                    j.journalType = info.type || journalType;
                    j.journalId = parseInt(info.index, 10);

                    j = await this.journalService.find(j) || j;
                    j.isPublish = true;
                    j.ip = req.ip;
                    await this.journalService.save(j);
                }
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
            journals
        }
    }

    @Post('dev/upload')
    @UseInterceptors(FileInterceptor('file'))
    async devUpload(@UploadedFile() file, @Body() bd, @Request() req) {
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
        let journals;
        if (uploadType === 'version') {
            setPath = this.changePathToDev(`${journal.filePath}/${file.originalname}`)
            
            fs.writeFile(`${setPath}`, file.buffer, () => {
                this.logService.info(`${setPath}`);
            });
    
        } else if (uploadType === 'pdf') {
            if (fileType === 'txt') {
                setPath = this.changePathToDev(`${journal.path}/${file.originalname}`);
                journals = this.parseTxt(this.parseBuffer(file.buffer));
                const info = this.parseName(file.originalname);
                for (let index = 0; index < journals.length; index++) {
                    this.logService.info(`save journal`);
                    const item = journals[index];
                    let j = new Journal();
                    j.journalTime = info.time;
                    j.journalType = info.type || journalType;
                    j.journalId = index + 1;
                    
                    j = await this.journalService.find(j) || j;

                    j.artTitle = item.title;
                    j.userName = item.name;
                    j.ip = req.ip;
                    this.logService.info(j);
                    await this.journalService.save(j);
                }
            } else if (fileType === 'pdf') {
                setPath = this.changePathToDev(`${journal.pdfPath}/${file.originalname}`);
                const info = this.parseName(file.originalname);
                if (info) {
                    let j = new Journal();
                    this.logService.info(info);
                    j.journalTime = info.time;
                    j.journalType = info.type || journalType;
                    j.journalId = parseInt(info.index, 10);

                    j = await this.journalService.find(j) || j;
                    j.isPublish = true;
                    j.ip = req.ip;
                    await this.journalService.save(j);
                }
            } else {
                return {
                    code: 2,
                    msg: '不支持的文件类型',
                }
            }
            fs.writeFile(`${setPath}`, file.buffer, () => {
                if (fileType === 'txt' || journalType === 'IJOMSR' || journalType === 'JSSHL' || journalType === 'WJIMT') {
                    exec(`node test.js`, {
                        cwd: `${this.changePathToDev(journal.path)}`,
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
            journals
        }
    }
}

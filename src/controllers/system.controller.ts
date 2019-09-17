import { Controller, UseGuards, UseInterceptors, Post, Body, FileInterceptor, UploadedFile, Req } from '@nestjs/common';
import { diskStorage } from 'multer';
const { exec } = require('child_process');

import { LogService } from '../services/log.service';
import { JournalService }  from '../services/journal.service';
import { Journal } from '../static/entity/journal.entity';
import { UploadGuard } from '../middleware/upload.guard';
import { TimeoutInterceptor } from '../middleware/timeout.interceptor';
import {
    JournalSubmit,
    JournalGetInfo,
    JournalUpdate,
    JournalDelete,
} from '../static/dto/journal.dto';
import { CsrfGuard } from '../middleware/csrf.guard';

@UseGuards(CsrfGuard)
@UseInterceptors(TimeoutInterceptor)
@Controller()
export class SystemController {
    constructor(
        private readonly logger: LogService,
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
    async upload(@Body() bd, @Req() req) { // JournalSubmit
        this.logger.debug(bd);
        this.logger.debug(req.file);
        const { filename } = req.file;
        bd.path = filename;
        try {
            await this.journalService.saveByOption(bd);
        } catch (e) {
            this.logger.debug(e);
            this.logger.error(e);
            return {
                code: 10002,
                msg: e.msg,
            }
        }
        return {
            code: 10000,
        }
    }

    @Post('getUploadInfo')
    async getUploadInfo(@Body() bd: JournalGetInfo) {
        let infos: Journal[];
        try {
            infos = await this.journalService.searchAll({
                uid: bd.uid,
            });
        } catch (e) {
            return {
                code: 10004,
                msg: e,
            }
        }

        return {
            code: 10000,
            data: infos,
        }
    }

    @Post('updateUploadInfo')
    async updateInfo(@Body() bd: JournalUpdate, @Req() req) {
        let journal = await this.journalService.search({
            jid: bd.jid,
            uid: bd.uid,
        });
        const file = req.file;
        this.logger.debug(typeof journal.jid);
        if (journal) {
            journal = Object.assign({}, journal, bd);
            journal.jid = parseInt((journal.jid as any), 10);
            if (file) {
                const oldFilePath = journal.path;
                journal.path = file.filename;
                exec(`rm -rf ../files/${oldFilePath}`, {}, (error) => {
                    this.logger.error(error);
                });
            }
            try {
                await this.journalService.save(journal);
            } catch (e) {
                this.logger.debug(e);
                this.logger.error(e);
                return {
                    code: 10004,
                    msg: e,
                }
            }
        }

        return {
            code: 10000,
            data: journal,
        }
        
    }

    @Post('deleteUploadInfo')
    async deleteInfo(@Body() bd: JournalDelete) {
        try {
            await this.journalService.delete({
                jid: bd.jid,
                uid: bd.uid,
            });
        } catch (e) {
            return {
                code: 10004,
                msg: e
            }
        }

        let infos: Journal[];
        try {
            infos = await this.journalService.searchAll({
                uid: bd.uid,
            });
        } catch (e) {
            return {
                code: 10004,
                msg: e,
            }
        }

        return {
            code: 10000,
            data: infos,
        }
    }
}

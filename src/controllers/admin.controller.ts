import { Controller, UseGuards, UseInterceptors, Post, Body, FileInterceptor, UploadedFile, Req } from '@nestjs/common';

import { LogService } from '../services/log.service';
import { JournalService }  from '../services/journal.service';
import { UserService }  from '../services/user.service';
import { User } from '../static/entity/user.entity';
import { TimeoutInterceptor } from '../middleware/timeout.interceptor';
import {
    searchJournal,
    publishJournal,
    addPublishDto,
} from '../static/dto/admin.dto';
import { adminGuard } from '../middleware/admin.guard';
const request = require('request');
const fs = require('fs');

@UseGuards(adminGuard)
@UseInterceptors(TimeoutInterceptor)
@Controller()
export class AdminController {
    constructor(
        private readonly logger: LogService,
        private readonly journalService: JournalService,
        private readonly userService: UserService
    ) {}

    private changeFileName(oldFile: string, newFile: string): Promise<void | Error> {
        return new Promise((resolve, reject) => {
            fs.rename(oldFile, newFile, (err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve();
                }
            });
        });
    }
    @Post('searchJournal')
    async searchJournal(@Body() bd: searchJournal) {
        const { account, email, updateTime } = bd;
        let user: User;
        if (account || email) {
            const accountCheck = await this.userService.search({
                account,
            });
            const emailCheck = await this.userService.search({
                email,
            });
            user = accountCheck || emailCheck;
            if (!user) {
                return {
                    code: 10001,
                    msg: 'this account or email can not find',
                };
            }
        }

        const journals = await this.journalService.complexSearch({
            uid: user ? user.id : null,
            updateTime,
        });

        return {
            code: 10000,
            data: journals,
        };
    }

    @Post('addPublishName')
    async addPublishName(@Body() bd: addPublishDto) {
        const journal = await this.journalService.search({
            jid: bd.jid,
        });

        if (!journal) {
            return {
                code: 10004,
                msg: `can not find journal with jid: ${bd.jid}`,
            }
        }

        journal.publishName = bd.publishName;
        await this.journalService.save(journal);
        return {
            code: 10000,
        }
    }

    @Post('publishJournal')
    async publishJournal(@Body() bd: publishJournal) {
        const journal = await this.journalService.search({
            jid: bd.jid,
        });
        
        if (!journal) {
            return {
                code: 10004,
                msg: `can not find journal with jid: ${bd.jid}`,
            }
        }

        if (!journal.publishName || journal.publishName === 'nothing') {
            return {
                code: 10004,
                msg: `journal can not find publishName`,
            }
        }

        journal.publishStatus = true;
        await this.journalService.save(journal);

        try {
            await this.changeFileName(`//Users/bilibili/github/files/${journal.path}`, `//Users/bilibili/github/files/${journal.publishName}`)
            const send = request.post('http://45.32.84.18:4000/upload');
            const form = send.form();
            form.append('ts', Date.now());
            form.append('journalType', journal.submitType.toUpperCase());
            form.append('file', fs.createReadStream(`//Users/bilibili/github/files/${journal.publishName}`));
            await this.changeFileName(`//Users/bilibili/github/files/${journal.publishName}`, `//Users/bilibili/github/files/${journal.path}`)
        } catch(e) {
            this.logger.debug(e);
            this.logger.error(e);
        }
        return {
            code: 10000
        };
    }
}
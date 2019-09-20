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

        if (!bd.publishName.match(/(.pdf)$/g)) {
            return {
                code: 10004,
                msg: `publishName should be pdf`,
            }
        }

        journal.publishName = bd.publishName;
        journal.publishStatus = true;

        await this.journalService.save(journal);


        try {
            const journalType = journal.submitType === 'bryanhousepub' ? 'bryanhousepub' : journal.submitType.toUpperCase();
            await this.changeFileName(`/home/files/${journal.path}`, `/home/files/${bd.publishName}`);
            const formData = {
                ts: Date.now(),
                journalType,
                file: fs.createReadStream(`/home/files/${bd.publishName}`),
            };

            const res = await this.asyncRequest('http://45.32.84.18:4000/upload', formData);
            this.logger.debug(typeof res.body);
            this.logger.debug(res.body.code);
            await this.changeFileName(`/home/files/${bd.publishName}`, `/home/files/${journal.path}`);
            if (res.body && res.body.code !== 1) {
                return {
                    code: 10003,
                    msg: res.body.msg,
                };
            }
        } catch(e) {
            this.logger.debug(e);
            this.logger.error(e);
            return {
                code: 10005,
                msg: 'server error',
            };
        }
        return {
            code: 10000
        };
    }

    async asyncRequest(url: string, formData: any): Promise<any>{
        return new Promise((resolve) => {
            request.post({
                url,
                formData,
            }, (err, httpResponse, body) => {
                resolve({
                    err,
                    httpResponse,
                    body: JSON.parse(body),
                });
            })
        });
    }
}
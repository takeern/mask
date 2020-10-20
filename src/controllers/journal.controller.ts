import { Controller, Get, Post, Body, Query, Response, FileInterceptor, UploadedFile, UseInterceptors, Request } from '@nestjs/common';
import { LogService } from '../services/log.service';
import { UploadGuard } from '../guards/upload.guard';
import { JournalService } from '../services/journal.service';
import { Journal } from '../static/entity/journal.entity';


@Controller()
export class JournalController { 
  constructor(
    private readonly logService: LogService,
    private readonly journalService: JournalService
  ) { }
  
  @Get('getJournalTime')
  async getJournalTime(@Request() req, @Query() query, @Response() res) { 
    const { journalType } = query;
    if (!journalType) {
      return res.send({
        code: -1,
        msg: '请输入 journalType',
      });
    }
    const data = await this.journalService.searchTime(journalType);

    return res.send({
      code: 10000,
      data: data,
    });
  }

  @Get('getJournals')
  async getJournals(@Query() query, @Response() res) {
    const { journalType, journalTime } = query;

    if (!journalType || !journalTime) {
      return res.send({
        code: -1,
        msg: '请求不合法',
      });
    }

    const [journals, count] = await this.journalService.getJournals(journalType, journalTime);

    return res.send({
      code: 10000,
      data: {
        journals,
        count
      },
    });
  }

  @Get('searchJournals')
  async searchJournals(@Query() query, @Response() res) { 
    const { artTitle } = query;

    const [journals, count] = await this.journalService.searchJournals(artTitle);

    return res.send({
      code: 10000,
      data: {
        journals,
        count
      },
    });
  }

}
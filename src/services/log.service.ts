import { Injectable } from '@nestjs/common';
import { configure, getLogger } from 'log4js'
const log4js = require('log4js');

@Injectable()
export class LogService {
    private logInfo: any;
    private logError: any;
    private logCount: any;
    private logDebug: any;
    constructor() {
        configure({
            appenders: {
                debug: { type: 'console' },
                info: { type: 'dateFile', filename: './log/cheese.log' },
                error: { type: 'file', filename: './log/error.log' },
                count: { type: 'file', filename: './log/count.log' },
            },
            categories: { 
                info: { appenders: ['info'], level: 'info' },
                error: { appenders: ['error'], level: 'error' },
                count: { appenders: ['count'], level: 'info' },
                debug: { appenders: ['debug'], level: 'debug' },
                default: { appenders: ['debug'], level: 'info' },
            }
        });
        this.logInfo = log4js.getLogger('info');
        this.logError = log4js.getLogger('error');
        this.logCount = log4js.getLogger('count');
        this.logDebug = log4js.getLogger('debug');
    }
    public debug(message: any) {
        this.logDebug.debug(message);
    }
    public info(message: any) {
        this.logInfo.info(message);
    }
    public error(message: any) {
        this.logError.error(message);
    }
    public count(message: any) {
        this.logCount.info(message);
    }
}
import { NestMiddleware } from '@nestjs/common';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AccessMiddleware implements NestMiddleware {
    fiterData(data, path) {
        let msg;
        switch (path) {
            case ('/getBookNumber'): {
                if (!data.bookName) {
                    msg = 'bookName is undefined';
                }
                break;
            }
            case ('/getBookData'): {
                if (!data.bookHref) {
                    msg = 'bookHref is undefined';
                }
                break;
            }
            default: {
                if (!data.bookNumber) {
                    msg = 'bookNumber is undefined';
                }
                break;
            }
        }
        return msg;
    }

    resolve(): (req, res, next) => void {
        return (req, res, next) => {
            res.header("Access-Control-Allow-Credentials", "true");
            res.header('Access-Control-Allow-Origin', "http://localhost:8080");
            res.header("Access-Control-Allow-Headers", "Origin,No-Cache,X-Requested-With,If-Modified-Since,Pragma,Last-Modified,Cache-Control,Expires,Content-Type,Access-Control-Allow-Credentials,DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Cache-Webcdn,x-bilibili-key-real-ip");
            res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
            next();
        }
    }
}
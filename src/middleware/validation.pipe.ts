import {
    ArgumentMetadata,
    Injectable,
    PipeTransform,
    BadRequestException,
    Logger,
  } from '@nestjs/common';
  import { validate } from 'class-validator';
  import { plainToClass } from 'class-transformer';
  
@Injectable()
export class ValidationPipe implements PipeTransform<any> {
    async transform(value: any, metadata: ArgumentMetadata) {
        const { metatype } = metadata;
        if (!metatype) {
            return value;
        }
        const object = plainToClass(metatype, value);
        const errors = await validate(object);
        if (errors.length > 0) {
        // 遍历全部的错误信息,返回给前端
            let msg: string;
            for (let key in errors[0].constraints) {
                msg = errors[0].constraints[key];
            }
            throw new BadRequestException({
                code: 10001,
                msg,
            });
        }
        return value;
    }


}

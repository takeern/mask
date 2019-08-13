import { Controller, Post, Body, Get, Query, Res } from '@nestjs/common';
import { LogService } from '../services/log.service';
import { UserService }  from '../services/user.service';
import { AuthService }  from '../services/auth.service';
import { User } from '../static/entity/user.entity';
import { checkObjMiss } from '../ulit/ulit';
import {
    UserSignInDto,
    UserCheckCodeDto,
    UserRegisterDto,
} from '../static/dto/user.dto';



@Controller()
export class UserController {
    static resError(code: number, msg: string) {
        return {
            code,
            msg,
        }
    }
    constructor(
        private readonly userService: UserService,
        private readonly logger: LogService,
        private readonly authService: AuthService,
        ) {}

    @Post('register')
    async register(@Body() bd: UserRegisterDto) {
        const { account, password, email } = bd;
    
        if (await this.checkOption('email', email) || await this.checkOption('account', account)) {
            return UserController.resError(10001, `The account has been registered.`)
        }

        const user = new User();
        user.account = account;
        user.password = password;
        user.email = email;
        try {
            await this.userService.save(user);
        } catch(e) {
            this.logger.error(e)
            return UserController.resError(10001, e)
        }
        return {
            code: 10000,
        }
    }

    @Get('getCheckCode')
    async getRegisterCode(@Query() qs: UserCheckCodeDto) {
        const { type, value } = qs;


        const user = await this.userService.search({
            [type]: value,
        });

        if (user) {
            return {
                code: 10002,
                msg: `The ${type} has been registered.`,
            }
        }

        let resMsg = null;
        if (type === 'email') {
            // todo: send email
            resMsg = 4575;
        }

        return { code: 10000, resMsg };
    }

    @Get('signIn')
    async signIn(@Query() qs: UserSignInDto, @Res() response) {
        const { account, password } = qs;
        const user = await this.userService.search({
            account,
            password,
        });
        
        const token = await this.authService.createToken({
            email: user.email,
        });
        response.cookie('token', token);
        return response.send({
            code: 10000,
        });
    }

    @Get('signOut')
    async signOut(@Res() response) {
        response.cookie('token', '');
        return response.send({
            code: 10000,
        });
    }

    private async checkOption(type: string, value: string) {
        const user = new User();
        user[type] = value;
        return await this.userService.find(user);
    }
}
import { Controller, Post, Body, Get, Query, Res, Req } from '@nestjs/common';
import { LogService } from '../services/log.service';
import { UserService }  from '../services/user.service';
import { AuthService }  from '../services/auth.service';
import { User } from '../static/entity/user.entity';
import {
    UserSignInDto,
    UserCheckCodeDto,
    UserRegisterDto,
} from '../static/dto/user.dto';



@Controller()
export class UserController {
    static resError(code: number, msg: string, value?: any) {
        return {
            code,
            msg,
            value,
        }
    }
    constructor(
        private readonly userService: UserService,
        private readonly logger: LogService,
        private readonly authService: AuthService,
        ) {}

    @Post('register')
    async register(@Body() bd, @Res() response) {
        this.logger.debug('register');
        const { account, password, email } = bd;
        
        if (await this.checkOption('email', email)) {
            return response.send(UserController.resError(10001, `The email has been registered.`, { type: 'email' }));
        }

        if (await this.checkOption('account', account)) {
            return response.send(UserController.resError(10001, `The account has been registered.`, { type: 'account' }));
        }

        const user = new User();
        user.account = account;
        user.password = password;
        user.email = email;
        this.logger.debug(User);
        try {
            await this.userService.save(user);
        } catch(e) {
            this.logger.error(e)
            return UserController.resError(10001, e)
        }
        await this.setToken(response, user);
        return response.send({
            code: 10000,
        });
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

    @Post('signIn')
    async signIn(@Body() bd: UserSignInDto, @Res() response, @Req() req) {
        const { account, password } = bd;

        const accountCheck = await this.userService.search({
            account,
            password,
        });
        const emailCheck = await this.userService.search({
            email: account,
            password,
        });

        const user = accountCheck || emailCheck;
        
        if (!user) {
            response.send({
                code: 10002,
                msg: 'the account with this keycode was not found.',
            });
        }

        await this.setToken(response, user);
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

    private async setToken(res: any, user: User) {
        const token = await this.authService.createToken({
            email: user.email,
        });
        res.cookie('token', token, {
            httpOnly: true,
            expires: new Date(Date.now() + 30 * 60 * 24 * 1000),
        });
    }
}
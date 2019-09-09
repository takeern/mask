import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../static/entity/user.entity';
import { AuthService }  from './auth.service';

interface IOption {
    email?: string;
    account?: string;
    password?: string;
    token?: string;
}

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly authService: AuthService,
    ) { }

    async save(user: User): Promise<User> {
        return this.userRepository.save(user);
    }

    async find(user: User): Promise<User> {
        return this.userRepository.findOne(user);
    }

    async search(option: IOption): Promise<User> {
        let user = new User();
        if (option.token) {
            const tkUser = await this.authService.validateUser(option.token);
            for (let key in tkUser) {
                user[key] = tkUser[key];
            }
        } else {
            user = { ...user, ...option };
        }
        return this.userRepository.findOne(user);
    }
}
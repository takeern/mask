import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../static/entity/user.entity';

interface IOption {
    email?: string;
    account?: string;
    password?: string;
}

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) { }

    async save(user: User): Promise<User> {
        return this.userRepository.save(user);
    }

    async find(user: User): Promise<User> {
        return this.userRepository.findOne(user);
    }

    async search(option: IOption): Promise<User> {
        let user = new User();
        user = { ...user, ...option };
        return this.userRepository.findOne(user);
    }
}
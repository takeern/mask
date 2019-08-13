import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

interface JwtPayload {
    email: string;
}

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService) {}

    async createToken(payload: JwtPayload) {
        return await this.jwtService.sign(payload, {
            expiresIn: '1440h',
        });
    }

    async validateUser(token: string): Promise<any> {
        const user = await this.jwtService.decode(token);
        return user;
    }
}

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from '../services/auth.service';
import { JwtStrategy } from '../services/jwt.strategy';

@Module({
    imports: [
        JwtModule.register({
            secret: 'ma$hh&SD@#45&',
        }),
    ],
    providers: [AuthService],
    exports: [AuthService],
})
export class AuthModule {}
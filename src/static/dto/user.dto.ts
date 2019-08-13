import { IsEmail, IsNotEmpty, IsInt } from 'class-validator';

class UserRegisterDto {
    @IsEmail()
    email: string;
  
    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    account: string;
}

class UserCheckCodeDto {
    @IsNotEmpty()
    type: string;
  
    @IsNotEmpty()
    value: string;
}

class UserSignInDto {
    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    account: string;
}

export {
    UserSignInDto,
    UserCheckCodeDto,
    UserRegisterDto,
}
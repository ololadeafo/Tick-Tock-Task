import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IsEmail, IsNotEmpty } from 'class-validator';
import * as sanitizeHTML from 'sanitize-html';
import { Transform } from 'class-transformer';

export class SignUpDto {
    @IsNotEmpty()
    @Transform((params) => sanitizeHTML(params.value))
    name: string;

    @IsEmail()
    @Transform((params) => sanitizeHTML(params.value))
    email: string;

    @IsNotEmpty()
    @Transform((params) => sanitizeHTML(params.value))
    username: string;

    @IsNotEmpty()
    password: string;
};

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('sign-up')
    signUp(@Body() signUpDto: SignUpDto) {
        return this.authService.signUp(signUpDto);
    }
}

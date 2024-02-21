import { Body, Controller, Post, Request, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IsEmail, IsNotEmpty } from 'class-validator';
import * as sanitizeHTML from 'sanitize-html';
import { Transform } from 'class-transformer';
import { AuthGuard } from './auth.guard';

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
    @Transform((params) => sanitizeHTML(params.value))
    password: string;
};

export class LogInDto {
    @IsNotEmpty()
    @Transform((params) => sanitizeHTML(params.value))
    username: string;

    @IsNotEmpty()
    @Transform((params) => sanitizeHTML(params.value))
    password: string;
};

export class AccountDetailDto {
    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    field: string;

    @IsNotEmpty()
    @Transform((params) => sanitizeHTML(params.value))
    value: string;
};

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('sign-up')
    signUp(@Body() signUpDto: SignUpDto) {
        return this.authService.signUp(signUpDto);
    }

    @Post('log-in')
    logIn(@Body() logInDto: LogInDto) {
        return this.authService.logIn(logInDto);
    }
    
    @UseGuards(AuthGuard)
    @Post('change-account-detail')
    changeAccountDetail(@Body() accountDetailDto: AccountDetailDto) {
        return this.authService.changeAccountDetails(accountDetailDto);
    }
    
    @UseGuards(AuthGuard)
    @Get('profile')
    getProfileData(@Request() req) {
        return this.authService.getProfileData(req.user.username);
    }
}


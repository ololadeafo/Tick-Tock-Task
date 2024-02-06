import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './auth.controller';

@Injectable()
export class AuthService {
    constructor(private userService: UsersService, private jwtService: JwtService) {}

    async hashPassword(password: string) {
        const saltRounds = 10;
        return await bcrypt.hash(password, saltRounds);
    }

    async createAccessToken(user) {
        const payload = { sub: user.userId, username: user.username };
        return await this.jwtService.signAsync(payload);
    }

    async signUp(signUpDto: SignUpDto) {
        //check if user already exist
        const usernameExists = (await this.userService.findUserByUsername(signUpDto.username)).length > 0;
        const emailExists = (await this.userService.findUserByEmail(signUpDto.email)).length > 0;

        if(usernameExists) {
            throw new BadRequestException('username already exists')
        }

        if(emailExists) {
            throw new BadRequestException('email already exists')
        }
        //check if email exists
        const hashedPassword = await this.hashPassword(signUpDto.password)
        signUpDto.password = hashedPassword;

        const user = await this.userService.createUser(signUpDto)
        return await this.createAccessToken(user);
    }
}

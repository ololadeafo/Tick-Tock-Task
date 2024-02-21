import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AccountDetailDto, LogInDto, SignUpDto } from './auth.controller';

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
        const usernameExists = (await this.userService.findUserByUsername(signUpDto.username))?.username;
        const emailExists = (await this.userService.findUserByEmail(signUpDto.email))?.email;

        if(usernameExists) {
            throw new BadRequestException('username already exists')
        }

        if(emailExists) {
            throw new BadRequestException('email already exists')
        }
        const hashedPassword = await this.hashPassword(signUpDto.password)
        signUpDto.password = hashedPassword;

        const user = await this.userService.createUser(signUpDto)
        return await this.createAccessToken(user);
    }
    async verifyPassword(enteredPassword: string, existingPassword: string) {
        return await bcrypt.compare(enteredPassword, existingPassword)
    }
    async logIn(logInDto: LogInDto) {
        const user = await this.userService.findUserByUsername(logInDto.username)
        console.log('USER', user)
        if (!user) {
            throw new UnauthorizedException();
        }
        const passwordsMatch = await this.verifyPassword(logInDto.password, user.password);
        if (!passwordsMatch) {
            throw new UnauthorizedException('Incorrect password');
        }
        return await this.createAccessToken(user);
    }

    async changeAccountDetails(accountDetailDto: AccountDetailDto) {
        const user = await this.userService.findUserByUsername (
            accountDetailDto.username,
        );
        
        if (accountDetailDto.field === 'password') {
            const plainTextPassword = accountDetailDto.value;
            const hashedPassword = await this.hashPassword(plainTextPassword);
            user[accountDetailDto.field] = hashedPassword;
        } else {
            user[accountDetailDto.field] = accountDetailDto.value;
        }

        return await this.userService.createUser(user);
    }
    async getProfileData(username: string) {
        console.log("USERNAME", username)
        const user = await this.userService.findUserByUsername(username);
        return {
            email: user.email,
            name: user.name,
            username: user.username
        }
    }
}

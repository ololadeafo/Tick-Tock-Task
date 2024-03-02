import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { MailModule } from 'src/mail/mail.module';


@Module({
  controllers: [AuthController],
  providers: [AuthService,],
  imports: [
    UsersModule,
    MailModule,
    JwtModule.register({
      global: true,
      secret: 'this is my secret',
      signOptions: {expiresIn: '90s' },
    }),
  ],
})
export class AuthModule {}

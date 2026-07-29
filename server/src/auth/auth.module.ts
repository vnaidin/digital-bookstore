import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable must be set');
}

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '12h', algorithm: 'HS256' },
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [JwtModule],
})
export class AuthModule {}

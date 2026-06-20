import { Body, Controller, Post, Req } from '@nestjs/common';
import { ApiOperation,ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.dto';
import { SignUpDto } from './dto/signup.dto';

@ApiTags('auth')
@Controller('api/auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Register a new user' })
  signup(@Body() dto: SignUpDto, @Req() req: any) {
    return this.auth.signup(dto, req.headers.origin || '');
  }

  @Post('signin')
  @ApiOperation({ summary: 'Sign in' })
  signin(@Body() dto: SignInDto) {
    return this.auth.signin(dto);
  }

  @Post('requestResetPass')
  requestResetPass(@Body('email') email: string, @Req() req: any) {
    return this.auth.requestResetPassword(email, req.headers.origin || '');
  }

  @Post('resetPass')
  resetPass(@Body() body: { id: number; token: string; password: string }, @Req() req: any) {
    return this.auth.resetPassword(body.id, body.token, body.password, req.headers.origin || '');
  }
}

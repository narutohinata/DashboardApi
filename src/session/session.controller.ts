import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiProperty } from '@nestjs/swagger';
import { AuthService } from 'src/auth/auth.service';

export class LoginData {
  @ApiProperty()
  username: string;

  @ApiProperty()
  password: string;
}

@Controller()
export class SessionController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  @ApiBody({
    type: LoginData,
  })
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}

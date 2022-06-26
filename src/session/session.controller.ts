import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import * as _ from 'lodash';
import { ApiBody, ApiProperty } from '@nestjs/swagger';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from '@prisma/client';

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

  @UseGuards(JwtAuthGuard)
  @Get('queryCurrentUser')
  async currentUser(@Request() req) {
    return _.pick(req.user as User, ['email', 'username']);
  }
}

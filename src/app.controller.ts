import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiHeaders,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';

import { User } from '@prisma/client';
import { Response } from 'express';
import { AppService } from './app.service';
import { UserService } from './user/user.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import * as Joi from 'joi';
import { RequiredValidationPipe } from './required-validation.pipe';

export type ResponseData<T> = {
  data: T;
  success: boolean;
};

export type CreateUserType = {
  email: string;
  username: string;
  password: string;
};

export class FindUserByIdDto {
  id: number;
}

export class CreateCatDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  password: string;
}

const Schema = Joi.object({
  id: Joi.number().required(),
});

@ApiTags('apis')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly userService: UserService,
  ) {}

  @Get()
  getHello(): {
    data: string;
  } {
    return this.appService.getHello();
  }

  @Get('users')
  @ApiOperation({ summary: 'Create cat' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async getUsers(): Promise<User[]> {
    return this.userService.users({});
  }

  @ApiBearerAuth('jwt')
  @ApiHeaders([
    {
      name: 'Authorization',
    },
  ])
  @UseGuards(JwtAuthGuard)
  @Get('users/:id')
  async getUserById(
    @Param('id', ParseIntPipe, new RequiredValidationPipe()) id: number,
    @Request() req,
    @Res() response: Response,
  ): Promise<Response<ResponseData<User>>> {
    const user = await this.userService.user({ id });
    console.log('req.user', req.user);
    if (user) {
      console.log('---------');
      return response.status(HttpStatus.OK).send({
        success: true,
        data: user,
      });
    } else {
      return response.status(HttpStatus.NOT_FOUND).send({
        success: false,
        data: null,
      });
    }
  }

  @Post('users')
  @ApiBody({
    type: CreateCatDto,
  })
  async createUser(@Body() body: CreateCatDto) {
    try {
      const createdUser = await this.userService.createUser({
        username: body.username,
        email: body.email,
        password_digest: body.password,
      });
      return createdUser;
    } catch (error) {
      return null;
    }
  }

  @Get('menus')
  async getMenus() {
    return [
      {
        path: '/welcome',
        name: 'home',
        locale: 'menu.home',
        icon: 'home',
      },
      {
        path: '/admin',
        name: 'admin',
        locale: 'menu.admin',
        access: 'canAdmin',
        icon: 'crown',
        children: [
          {
            path: '/admin/sub-page',
            name: 'sub-admin',
            locale: 'menu.admin.sub-page',
            icon: 'smile',
          },
        ],
      },
      {
        path: '/list',
        name: '列表',
        locale: 'menu.list',
        icon: 'table',
      },
    ];
  }

  @Get('permissions')
  async getPermissions(): Promise<string[]> {
    return ['canList', 'canAdminSubPage'];
  }
}

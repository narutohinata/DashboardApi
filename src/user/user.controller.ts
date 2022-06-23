import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiProperty } from '@nestjs/swagger';
import { encodePassword } from 'src/utils/bcrypt';
import { UserService } from './user.service';

export class CreateUserDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  password: string;
}
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  @ApiBody({
    type: CreateUserDto,
  })
  async signUp(@Body() body: CreateUserDto) {
    const { email, username, password } = body;
    const password_digest = await encodePassword(password);
    try {
      this.userService.createUser({
        email,
        username,
        password_digest,
      });
      return {
        success: true,
      };
    } catch (error) {
      console.log(error.message);
    }
  }
}

// src/users/users.controller.ts
import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(
    @Body('username') username: string,
    @Body('password') password: string,
    @Body('role') role: string, // optional
  ) {
    const user = await this.usersService.create(username, password, role);
    return {
      message: '회원가입 성공',
      user: {
        username: user.username,
        role: user.role,
      },
    };
  }

  // ✅ 유저 존재 여부 확인용 엔드포인트
  @Get(':username')
  async findByUsername(@Param('username') username: string) {
    const user = await this.usersService.findByUsername(username);
    if (!user) {
      return { exists: false };
    }
    return { exists: true };
  }
}

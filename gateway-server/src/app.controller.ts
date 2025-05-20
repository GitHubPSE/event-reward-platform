import {
  Controller,
  All,
  Req,
  Res,
  UseGuards,
  Get,
  Post,
  Body,
  Headers,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Request, Response } from 'express';
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RolesGuard } from './auth/roles.guard';
import { Roles } from './auth/roles.decorator';
import { User } from './auth/user.decorator';

@Controller('api')
export class AppController {
  constructor(private readonly httpService: HttpService) {}

  // ✅ /api/events 처리
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OPERATOR', 'ADMIN')
  @Post('events')
  async proxyEventsRoot(@Req() req: Request, @Res() res: Response) {
    return this.forwardRequest(req, res);
  }

  // ✅ /api/events/* 처리
  @All('events/*')
  async proxyEventsWildcard(@Req() req: Request, @Res() res: Response) {
    return this.forwardRequest(req, res);
  }

  // ✅ 전체 이력 조회: 관리자/감사자만 가능
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'AUDITOR')
  @All('rewards/requests/all')
  async proxyRewardRequestsAll(@Req() req: Request, @Res() res: Response) {
    return this.forwardRequest(req, res);
  }

  // ✅ 그 외 (claim, my 등): 인증 없이 통과
  @All('rewards/requests/:action') // e.g. claim, my
  async proxyRewardRequestsActions(@Req() req: Request, @Res() res: Response) {
    return this.forwardRequest(req, res);
  }

  // ✅ /api/rewards 처리
  @All('rewards')
  async proxyRewardsRoot(@Req() req: Request, @Res() res: Response) {
    return this.forwardRequest(req, res);
  }

  // ✅ /api/rewards/* 처리
  @All('rewards/*')
  async proxyRewardsWildcard(@Req() req: Request, @Res() res: Response) {
    return this.forwardRequest(req, res);
  }

  // ✅ 실제 프록시 로직 공통화
  private async forwardRequest(req: Request, res: Response) {
    const targetUrl = `http://event-server:3002${req.originalUrl.replace('/api', '')}`;
    const method = req.method.toLowerCase();

    console.log('🟡 [Gateway] Forwarding request to:', targetUrl);
    console.log('🟢 [Gateway] Method:', method);
    console.log('🔵 [Gateway] Headers:', req.headers);

    try {
      const response = await firstValueFrom(
        this.httpService.request({
          url: targetUrl,
          method,
          data: req.body,
          headers: {
            Authorization: req.headers['authorization'],
            'x-from-gateway': req.headers['x-from-gateway'],
          },
        }),
      );
      return res.status(response.status).json(response.data);
    } catch (err) {
      throw new HttpException(
        err.response?.data || '프록시 요청 실패',
        err.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ✅ 프로필 확인
  @Get('profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER', 'OPERATOR', 'ADMIN')
  getProfile(@User() user: any) {
    return {
      message: '인증된 유저입니다',
      user,
    };
  }
}

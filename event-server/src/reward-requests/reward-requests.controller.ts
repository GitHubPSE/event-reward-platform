// rewards/reward-requests.controller.ts
import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { RewardRequestsService } from './reward-requests.service';

@Controller('rewards/requests')
export class RewardRequestsController {
  constructor(private readonly rewardRequestsService: RewardRequestsService) {}

  // 유저가 보상 요청
  @Post('claim')
  async claim(@Body() body: { userId: string; eventId: string }) {
    return this.rewardRequestsService.claimReward(body.userId, body.eventId);
  }

  // 유저 본인 요청 이력 조회
  @Get('my')
  async getMyRequests(@Query('userId') userId: string) {
    return this.rewardRequestsService.findByUserId(userId);
  }

  // 전체 요청 이력 조회 (관리자용)
  @Get('all')
  async getAllRequests() {
    const results = await this.rewardRequestsService.findAll();
    return results;
  }
}

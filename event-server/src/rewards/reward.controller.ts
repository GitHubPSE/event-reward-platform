import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { RewardsService } from './reward.service';

@Controller('rewards')
export class RewardsController {
  constructor(private readonly rewardsService: RewardsService) {}

  // 보상 등록
  @Post()
  create(@Body() dto: any) {
    return this.rewardsService.create(dto);
  }

  // 특정 이벤트에 연결된 보상 조회
  @Get(':eventId')
  findByEventId(@Param('eventId') eventId: string) {
    return this.rewardsService.findByEventId(eventId);
  }

  // 전체 보상 목록 조회용 API 추가
  @Get()
  findAll() {
    return this.rewardsService.findAll();
  }
}

import { Controller, Post, Get, Body, Headers, Param } from '@nestjs/common';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  // 이벤트 등록
  @Post()
  create(@Body() dto: any, @Headers() headers: Record<string, any>) {
    console.log('🔥 headers:', headers);

    const auth = headers['authorization'];
    const isFromGateway = headers['x-from-gateway'];
    console.log('🔑 Auth:', auth);
    console.log('🌐 x-from-gateway:', isFromGateway);
    console.log('type:', typeof isFromGateway);

    return this.eventsService.create(dto);
  }

  // 이벤트 전체 조회
  @Get()
  findAll() {
    return this.eventsService.findAll();
  }

  // 이벤트 상세 조회
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }
}

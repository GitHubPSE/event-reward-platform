// src/reward-requests/reward-requests.module.ts
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import {
  RewardRequest,
  RewardRequestSchema,
} from './schema/reward-requests.schema';
import { RewardRequestsService } from './reward-requests.service';
import { RewardRequestsController } from './reward-requests.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RewardRequest.name, schema: RewardRequestSchema },
    ]),
    HttpModule,
  ],
  controllers: [RewardRequestsController],
  providers: [RewardRequestsService],
})
export class RewardRequestsModule {}

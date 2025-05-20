import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reward, RewardDocument } from './schemas/reward.schema';

@Injectable()
export class RewardsService {
  constructor(
    @InjectModel(Reward.name)
    private rewardModel: Model<RewardDocument>,
  ) {}

  // 보상 등록
  async create(dto: any): Promise<Reward> {
    return new this.rewardModel(dto).save();
  }

  // 특정 이벤트에 대한 보상 전체 조회
  async findByEventId(eventId: string): Promise<Reward[]> {
    return this.rewardModel.find({ eventId }).exec();
  }

  async findAll(): Promise<Reward[]> {
    return this.rewardModel.find().exec();
  }
}

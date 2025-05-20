import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RewardRequest } from './schema/reward-requests.schema';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class RewardRequestsService {
  constructor(
    @InjectModel(RewardRequest.name)
    private readonly rewardRequestModel: Model<RewardRequest>,
    private readonly httpService: HttpService,
  ) {}

  // 보상 요청 등록
  async claimReward(userId: string, eventId: string) {
    // 🔍 유저 존재 여부 확인
    const url = `http://auth-server:3001/users/${userId}`;
    try {
      const { data } = await firstValueFrom(this.httpService.get(url));
      if (!data.exists) {
        return { success: false, message: '존재하지 않는 유저입니다.' };
      }
    } catch (error) {
      return { success: false, message: '유저 확인 중 오류 발생' };
    }

    const exists = await this.rewardRequestModel.findOne({ userId, eventId });
    if (exists) {
      return { success: false, message: '이미 보상을 요청한 이벤트입니다.' };
    }

    const request = new this.rewardRequestModel({
      userId,
      eventId,
      status: 'SUCCESS',
    });

    await request.save();

    return { success: true, message: '보상 요청이 완료되었습니다.' };
  }

  // 🔍 유저별 보상 요청 내역 조회
  async findByUserId(userId: string) {
    return this.rewardRequestModel
      .find({ userId })
      .sort({ requestedAt: -1 })
      .exec();
  }

  // 🔍 전체 요청 내역 조회 (관리자용)
  async findAll() {
    return this.rewardRequestModel.find().sort({ requestedAt: -1 }).exec();
  }
}

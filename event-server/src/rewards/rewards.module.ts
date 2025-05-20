import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RewardsController } from './reward.controller';
import { RewardsService } from './reward.service';
import { Reward, RewardSchema } from './schemas/reward.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Reward.name, schema: RewardSchema }]),
  ],
  controllers: [RewardsController],
  providers: [RewardsService],
})
export class RewardsModule {}

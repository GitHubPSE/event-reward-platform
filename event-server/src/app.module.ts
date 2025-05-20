import 'dotenv/config';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventsModule } from './events/events.module';
import { RewardsModule } from './rewards/rewards.module';
import { RewardRequestsModule } from './reward-requests/reward-requests.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI),
    EventsModule,
    RewardsModule,
    RewardRequestsModule,
    HttpModule,
  ],
})
export class AppModule {}

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Reward {
  @Prop({ required: true })
  eventId: string; // 어떤 이벤트에 속한 보상인지

  @Prop({ required: true })
  type: string; // 보상 종류 (ex: 포인트, 쿠폰 등)

  @Prop()
  description?: string;

  @Prop({ required: true })
  quantity: number;
}

export type RewardDocument = Reward & Document;
export const RewardSchema = SchemaFactory.createForClass(Reward);

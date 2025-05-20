// src/users/schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: 'USER' })
  role: 'USER' | 'OPERATOR' | 'AUDITOR' | 'ADMIN';

  _id: Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Event, EventDocument } from './schemas/event.schema';
import { Model } from 'mongoose';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
  ) {}

  async create(dto: any): Promise<Event> {
    return new this.eventModel(dto).save();
  }

  async findAll(): Promise<Event[]> {
    return this.eventModel.find().exec();
  }

  async findOne(id: string): Promise<Event> {
    return this.eventModel.findById(id).exec();
  }
}

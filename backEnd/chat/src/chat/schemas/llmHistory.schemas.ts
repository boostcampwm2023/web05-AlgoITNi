import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaOptions } from 'mongoose';

export type LLMHistoryDocument = Document & LLMHistory;

const options: SchemaOptions = {
  timestamps: true,
};

@Schema(options)
export class LLMHistory {
  @Prop({ required: true })
  room: string;

  @Prop({
    required: true,
    type: [
      {
        role: { type: String, required: true },
        content: { type: String, required: true },
      },
    ],
  })
  messages: LLMMessageDto[];
}

export const LLMHistorySchema = SchemaFactory.createForClass(LLMHistory);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CodeDocument = HydratedDocument<Code>;

@Schema()
export class Code {
  @Prop({ require: true })
  userID: number;

  @Prop({ require: true })
  title: string;

  @Prop({ require: true })
  content: string;
}

export const CodeSchema = SchemaFactory.createForClass(Code);

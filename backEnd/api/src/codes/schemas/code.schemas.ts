import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { supportLang } from '../../common/supportLang';

export type CodeDocument = HydratedDocument<Code>;

@Schema()
export class Code {
  @Prop({ require: true })
  userID: number;

  @Prop({ require: true })
  title: string;

  @Prop({ require: true })
  content: string;

  @Prop({ require: true, default: 'python' })
  language: supportLang;
}

export const CodeSchema = SchemaFactory.createForClass(Code);

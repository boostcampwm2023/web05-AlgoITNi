import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { MongooseModule } from '@nestjs/mongoose';
import { LLMHistory, LLMHistorySchema } from './schemas/llmHistory.schemas';
import { ChatSingleGateway } from './chat-single.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LLMHistory.name, schema: LLMHistorySchema },
    ]),
  ],
  providers: [ChatGateway, ChatService, ChatSingleGateway],
})
export class ChatModule {}

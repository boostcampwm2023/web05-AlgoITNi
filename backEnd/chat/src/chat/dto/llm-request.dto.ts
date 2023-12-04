class LLMRequestDto {
  messages: LLMMessageDto[];

  topP: number;

  topK: number;

  maxTokens: number;

  temperature: number;

  repeatPenalty: number;

  stopBefore: string[];

  includeAiFilters: boolean;
}

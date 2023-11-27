import { Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { ERRORS, SOCKET } from '../common/utils';
import { JoinRoomDto } from './dto/join-room.dto';
import { GetOfferDto } from './dto/get-offer.dto';
import { GetIceCandidateDto } from './dto/get-ice.dto';
import { GetAnswerDto } from './dto/get-answer.dto';

@Injectable()
export class WebRtcService {
  validateJoinRoom(data: JoinRoomDto) {
    if (!data.room) {
      throw new WsException({
        statusCode: ERRORS.FAIL_JOIN_ROOM.statusCode,
        message: ERRORS.FAIL_JOIN_ROOM.message,
      });
    }
  }

  validateOffer(data: GetOfferDto) {
    if (!data.sdp || !data.offerReceiveId || !data.offerSendId) {
      throw new WsException({
        statusCode: ERRORS.FAIL_OFFER.statusCode,
        message: ERRORS.FAIL_OFFER.message,
      });
    }
  }

  validateAnswer(data: GetAnswerDto) {
    if (!data.sdp || !data.answerSendId || !data.answerReceiveId) {
      throw new WsException({
        statusCode: ERRORS.FAIL_ANSWER.statusCode,
        message: ERRORS.FAIL_ANSWER.message,
      });
    }
  }

  validateCandidate(data: GetIceCandidateDto) {
    if (!data.candidate || !data.candidateSendId || !data.candidateReceiveId) {
      throw new WsException({
        statusCode: ERRORS.FAIL_CANDIDATE.statusCode,
        message: ERRORS.FAIL_CANDIDATE.message,
      });
    }
  }

  isRoomFull(num: number) {
    if (num === SOCKET.ROOM_FULL) {
      throw new WsException({
        statusCode: ERRORS.ROOM_FULL.statusCode,
        message: ERRORS.ROOM_FULL.message,
      });
    }
  }
}

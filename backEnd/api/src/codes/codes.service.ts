import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Code } from './schemas/code.schemas';
import { Connection, Model } from 'mongoose';
import { SaveCodeDto } from './dto/saveCode.dto';
import {
  getSession,
  Transactional,
} from '../common/transaction/transaction.decorator';
import { ClientSession } from 'mongoose';
import { DeleteResult } from 'mongodb';

@Injectable()
export class CodesService {
  private logger = new Logger(CodesService.name);
  constructor(
    @InjectModel(Code.name) private codeModel: Model<Code>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  @Transactional('mongoose')
  async save(saveCodeDto: SaveCodeDto) {
    const session = getSession();
    const code = await this.codeModel.create([saveCodeDto], {
      session: session,
    });
    return code[0];
  }

  async getAll(userID: number) {
    return this.codeModel.find({ userID: userID }).exec();
  }

  async getOne(userID: number, objectID: string) {
    return this.codeModel.find({ userID: userID, _id: objectID }).exec();
  }
  @Transactional('mongoose')
  async update(userID: number, objectID: string, saveCodeDto: SaveCodeDto) {
    const query = { userID: userID, _id: objectID };
    const session: ClientSession = getSession();
    const result = await this.codeModel
      .updateOne(query, saveCodeDto)
      .session(session);
    return result;
  }

  @Transactional('mongoose')
  async delete(userID: number, objectID: string): Promise<DeleteResult> {
    const query = { userID: userID, _id: objectID };
    const session = getSession();
    return this.codeModel.deleteOne(query).session(session);
  }
}

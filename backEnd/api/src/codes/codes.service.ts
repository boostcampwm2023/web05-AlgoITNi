import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Code } from './schemas/code.schemas';
import { Connection, Model } from 'mongoose';
import { SaveCodeDto } from './dto/saveCode.dto';
import { TransactionRollback } from '../common/exception/exception';

@Injectable()
export class CodesService {
  private logger = new Logger(CodesService.name);
  constructor(
    @InjectModel(Code.name) private codeModel: Model<Code>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async save(saveCodeDto: SaveCodeDto): Promise<Code> {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const code = await this.codeModel.create(saveCodeDto);
      await session.commitTransaction();
      return code;
    } catch (e) {
      await session.abortTransaction();
      this.logger.error(e);
      throw new TransactionRollback();
    } finally {
      await session.endSession();
    }
  }

  async getAll(userID: number) {
    return this.codeModel.find({ userID: userID }).exec();
  }

  async getOne(userID: number, objectID: string) {
    return this.codeModel.find({ userID: userID, _id: objectID }).exec();
  }

  async update(userID: number, objectID: string, saveCodeDto: SaveCodeDto) {
    const query = { userID: userID, _id: objectID };
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const result = await this.codeModel.updateOne(query, saveCodeDto);
      await session.commitTransaction();
      return result;
    } catch (e) {
      await session.abortTransaction();
      this.logger.error(e);
      throw new TransactionRollback();
    } finally {
      await session.endSession();
    }
    return;
  }

  async delete(userID: number, objectID: string) {
    const query = { userID: userID, _id: objectID };
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      await this.codeModel.deleteOne(query);
      await session.commitTransaction();
    } catch (e) {
      await session.abortTransaction();
      this.logger.error(e);
      throw new TransactionRollback();
    } finally {
      await session.endSession();
    }
  }
}

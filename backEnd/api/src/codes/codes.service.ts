import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Code } from './schemas/code.schemas';
import { Model } from 'mongoose';
import { SaveCodeDto } from './dto/saveCode.dto';

@Injectable()
export class CodesService {
  constructor(@InjectModel(Code.name) private codeModel: Model<Code>) {}

  async save(saveCodeDto: SaveCodeDto): Promise<Code> {
    const savedCode = new this.codeModel(saveCodeDto);
    return savedCode.save();
  }

  async getAll(userID: number) {
    return this.codeModel.find({ userID: userID }).exec();
  }

  async getOne(userID: number, objectID: string) {
    return this.codeModel.find({ userID: userID, _id: objectID }).exec();
  }

  async update(userID: number, objectID: string, saveCodeDto: SaveCodeDto) {
    const query = { userID: userID, _id: objectID };
    return this.codeModel.updateOne(query, saveCodeDto);
  }

  async delete(userID: number, objectID: string) {
    const query = { userID: userID, _id: objectID };
    await this.codeModel.deleteOne(query);
  }
}

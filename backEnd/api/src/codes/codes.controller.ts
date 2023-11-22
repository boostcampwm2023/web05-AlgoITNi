import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Post,
  Req,
  UseGuards,
  Delete,
  Logger,
} from '@nestjs/common';
import { SaveCodeDto } from './dto/saveCode.dto';
import { CodesService } from './codes.service';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/auth.guard';
import { UserInfoDto } from '../users/dto/userInfo.dto';
import { ResourceNotFound } from '../common/exception/exception';

@UseGuards(JwtAuthGuard)
@Controller('codes')
export class CodesController {
  private logger = new Logger(CodesController.name);
  constructor(private readonly codesService: CodesService) {}

  @Post()
  async save(@Body() saveCodeDto: SaveCodeDto, @Req() req: Request) {
    const user: UserInfoDto = req.user as UserInfoDto;
    saveCodeDto.userID = user.id;
    return await this.codesService.save(saveCodeDto);
  }

  @Get()
  async getAll(@Req() req: Request) {
    const user: UserInfoDto = req.user as UserInfoDto;
    const userID = user.id;
    return await this.codesService.getAll(userID);
  }

  @Get(':id')
  async getOne(@Req() req: Request, @Param('id') id: string) {
    const user: UserInfoDto = req.user as UserInfoDto;
    const userID = user.id;
    const result = await this.codesService.getOne(userID, id);
    if (result.length === 0) {
      throw new ResourceNotFound();
    }
    return result;
  }

  @Put(':id')
  async update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() saveCodeDto: SaveCodeDto,
  ) {
    const user: UserInfoDto = req.user as UserInfoDto;
    const userID = user.id;
    const result = await this.codesService.update(userID, id, saveCodeDto);
    if (result.matchedCount === 0) {
      throw new ResourceNotFound();
    }
    return { message: 'update success' };
  }

  @Delete(':id')
  async delete(@Req() req: Request, @Param('id') id: string) {
    const user: UserInfoDto = req.user as UserInfoDto;
    const userID = user.id;
    try {
      await this.codesService.delete(userID, id);
      return { message: 'delete success' };
    } catch (e) {
      this.logger.error(e);
      throw new ResourceNotFound();
    }
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FeishuService } from './feishu.service';
import { CreateFeishuDto } from './dto/create-feishu.dto';
import { UpdateFeishuDto } from './dto/update-feishu.dto';

@Controller('feishu')
export class FeishuController {
  constructor(private readonly feishuService: FeishuService) {}
}

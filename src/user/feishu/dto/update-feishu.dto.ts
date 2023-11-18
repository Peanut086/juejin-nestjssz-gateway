import { PartialType } from '@nestjs/mapped-types';
import { CreateFeishuDto } from './create-feishu.dto';

export class UpdateFeishuDto extends PartialType(CreateFeishuDto) {}

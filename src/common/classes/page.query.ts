import { ApiPropertyOptional } from '@nestjs/swagger'

import { Transform } from 'class-transformer'
import { IsNumber, IsOptional, IsString } from 'class-validator'

export class PageQuery {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => +value)
  limit: number

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  afterCursor: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  beforeCursor: string
}

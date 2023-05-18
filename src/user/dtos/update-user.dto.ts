import { ApiPropertyOptional } from '@nestjs/swagger';

import { IUser } from '../interfaces/user.interface';
import { IsOptional, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDto implements Partial<IUser> {
  @ApiPropertyOptional({ example: 'Jane Doe' })
  @IsOptional()
  @MinLength(2, {
    message:
      'It is required to send name with length greater than 2 characters',
  })
  @MaxLength(64, {
    message:
      'It is required to send a name with length lower than 64 characters',
  })
  name?: string;
}

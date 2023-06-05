import { ApiProperty } from '@nestjs/swagger';

import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Jane Doe' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'janedoe@email.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'janedoe' })
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'JaneDoe123*' })
  @IsNotEmpty()
  password: string;
}

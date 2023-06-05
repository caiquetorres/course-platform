import { ApiProperty } from '@nestjs/swagger';

import { IsEmail, IsNotEmpty } from 'class-validator';

/**
 * Data transfer object for creating a new user.
 */
export class CreateUserDto {
  /**
   * The name of the user.
   */
  @ApiProperty({ example: 'Jane Doe' })
  @IsNotEmpty()
  name: string;

  /**
   * The username of the user.
   */
  @ApiProperty({ example: 'janedoe' })
  @IsNotEmpty()
  username: string;

  /**
   * The email address of the user.
   */
  @ApiProperty({ example: 'janedoe@email.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  /**
   * The password of the user.
   */
  @ApiProperty({ example: 'JaneDoe123*' })
  @IsNotEmpty()
  password: string;
}

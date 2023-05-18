import { ApiProperty } from '@nestjs/swagger';

import { IUser } from '../interfaces/user.interface';
import {
  IsEmail,
  IsNotEmpty,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto implements Partial<IUser> {
  @ApiProperty({ example: 'Jane Doe' })
  @IsNotEmpty({ message: 'It is required to send the user name' })
  @MinLength(2, {
    message:
      'It is required to send name with length greater than 2 characters',
  })
  @MaxLength(64, {
    message:
      'It is required to send a name with length lower than 64 characters',
  })
  name: string;

  @ApiProperty({ example: 'janedoe' })
  @IsNotEmpty({ message: 'It is required to send the user username' })
  @MinLength(2, {
    message:
      'It is required to send name with length greater than 2 characters',
  })
  @MaxLength(64, {
    message:
      'It is required to send a username with length lower than 64 characters',
  })
  username: string;

  @ApiProperty({ example: 'jane.doe@puppy.com' })
  @IsNotEmpty({ message: 'It is required to send the user email' })
  @IsEmail({}, { message: 'It is required to send a valid email' })
  @MaxLength(128, {
    message:
      'It is required to send a email with length lower than 128 characters',
  })
  email: string;

  @ApiProperty({ example: '123456' })
  @IsNotEmpty({ message: 'It is required to send the user password' })
  @Matches(
    /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#@$!%*?&])[A-Za-z\d#@$!%*?&]{8,}/,
    {
      message:
        'It is required to send a password with at least 8 character, one uppercase letter, one number and one special character (#, @, $, !, %, *, ?, &)',
    },
  )
  password: string;
}

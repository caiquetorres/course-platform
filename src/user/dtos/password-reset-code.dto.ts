import { ApiProperty } from '@nestjs/swagger'

import { IsNotEmpty, Matches } from 'class-validator'

export class PasswordResetCodeDto {
  @ApiProperty({ example: '654321' })
  @Matches(/^[0-9]{6}$/, {
    message: 'It is require to send a code with 6 numeric characters',
  })
  code: string

  @ApiProperty({ example: '123456' })
  @IsNotEmpty({ message: 'It is required to send the user password' })
  @Matches(
    /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#@$!%*?&])[A-Za-z\d#@$!%*?&]{8,}/,
    {
      message:
        'It is required to send a password with at least 8 character, one uppercase letter, one number and one special character (#, @, $, !, %, *, ?, &)',
    },
  )
  newPassword: string
}

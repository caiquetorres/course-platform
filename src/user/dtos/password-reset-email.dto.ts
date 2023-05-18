import { ApiProperty } from '@nestjs/swagger'

import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator'

export class PasswordResetEmailDto {
  @ApiProperty({ example: 'jane.doe@puppy.com' })
  @IsNotEmpty({ message: 'It is required to send the user email' })
  @IsEmail({}, { message: 'It is required to send a valid email' })
  @MaxLength(128, {
    message:
      'It is required to send a email with length lower than 128 characters',
  })
  email: string
}

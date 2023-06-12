import { ApiPropertyOptional } from '@nestjs/swagger';

import { IsNotEmpty } from 'class-validator';

/**
 * Data transfer object for updating a user.
 */
export class UpdateUserDto {
  /**
   * The name of the user.
   */
  @ApiPropertyOptional({ example: 'Jane Doe' })
  @IsNotEmpty()
  name?: string;
}

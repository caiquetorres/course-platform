import { ApiProperty } from '@nestjs/swagger';

/**
 * Represents a TokenDto object containing a JSON Web Token (JWT) and its
 * expiration time.
 */
export class TokenDto {
  /**
   * The JWT string.
   */
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImU3MTVjOGUxLWMyMmItNDUwOS04NWZhLWM0MGQ2ZDUyZTMwMyIsImlhdCI6MTY2MjQxMDg5NSwiZXhwIjoxNjkzOTY4NDk1fQ.IZlYZAwvaUBKkaRyJ2r2PhcUqldKeWsJIuXr8oCheLo',
  })
  token: string;

  /**
   * The expiration time of the JWT in a string format.
   */
  @ApiProperty({ example: '1y' })
  expiresIn: string;

  constructor(partial: Partial<TokenDto>) {
    Object.assign(this, partial);
  }
}

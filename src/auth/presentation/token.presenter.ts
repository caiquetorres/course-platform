import { ApiProperty } from '@nestjs/swagger';

interface IToken {
  token: string;
  expiresIn: string;
}

export class TokenPresenter implements IToken {
  /**
   * The JWT string.
   */
  @ApiProperty({ example: '...' })
  token: string;

  /**
   * The expiration time of the JWT in a string format.
   */
  @ApiProperty({ example: '1y' })
  expiresIn: string;

  constructor(token: IToken) {
    this.token = token.token;
    this.expiresIn = token.expiresIn;

    Object.freeze(this);
  }
}

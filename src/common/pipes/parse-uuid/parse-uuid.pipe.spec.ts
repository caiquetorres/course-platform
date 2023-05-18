import { BadRequestException } from '@nestjs/common';

import { ParseUUIDPipe } from './parse-uuid.pipe';

describe('ParseUuidPipePipe (unit)', () => {
  let pipe: ParseUUIDPipe;

  beforeEach(() => {
    pipe = new ParseUUIDPipe();
  });

  it('should pass if passing a valid uuid', () => {
    expect(() => {
      pipe.transform('61e321ec-d0e5-4de6-8697-97bfb364fb7d');
    }).not.toThrow(BadRequestException);

    expect(() => {
      pipe.transform([
        '61e321ec-d0e5-4de6-8697-97bfb364fb7d',
        'f41ead6d-947d-471e-87db-87ba6b55eabb',
      ]);
    }).not.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when passing an invalid uuid', () => {
    expect(() => {
      pipe.transform('invalid-uuid');
    }).toThrow(BadRequestException);

    expect(() => {
      pipe.transform(['invalid-uuid', 'f41ead6d-947d-471e-87db-87ba6b55eabb']);
    }).toThrow(BadRequestException);
  });
});

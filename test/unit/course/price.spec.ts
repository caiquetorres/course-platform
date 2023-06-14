import { Price } from '../../../src/course/domain/value-objects/price';

describe('Price (unit)', () => {
  it('should create a price object', () => {
    expect(() => new Price(120)).not.toThrow(Error);
  });

  it('should convert the price to a number', () => {
    const price = new Price(120);
    expect(+price).toBe(120);
  });

  it('should throw an error saying that the price is invalid', () => {
    expect(() => new Price(-10)).toThrow(Error);
  });
});

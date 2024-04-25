import { Currency, InvalidCurrencyException } from '../src/currency';

describe('currencies', () => {
  it('should parse a valid currency successfully', () => {
    // GIVEN
    const givenCurrency = 'EUR';

    // WHEN
    const parsedCurrency = Currency.parse(givenCurrency);

    // THEN
    expect(parsedCurrency.code).toBe('EUR');
  });

  it('should fail to parse an invalid currency code', () => {
    // GIVEN
    const givenCurrency = 'ABC';

    // WHEN
    const parseCurrencyFunc = () => Currency.parse(givenCurrency);

    // THEN
    expect(parseCurrencyFunc).toThrowError(InvalidCurrencyException);
  });

  it('should fail to parse a random string', () => {
    // GIVEN
    const givenCurrency = '123qwerty';

    // WHEN
    const parseCurrency = () => Currency.parse(givenCurrency);

    // THEN
    expect(parseCurrency).toThrowError(InvalidCurrencyException);
  });

  it('should return true when comparing equal currencies', () => {
    // GIVEN
    const currency1 = Currency.parse('USD');
    const currency2 = Currency.parse('USD');

    // WHEN
    const isSameCurrency = currency1.equals(currency2);

    // THEN
    expect(isSameCurrency).toBe(true);
  });

  it('should return false when comparing different currencies', () => {
    // GIVEN
    const currency1 = Currency.parse('USD');
    const currency2 = Currency.parse('BRL');

    // WHEN
    const isSameCurrency = currency1.equals(currency2);

    // THEN
    expect(isSameCurrency).toBe(false);
  });

  it('should return the currency code when calling toString', () => {
    // GIVEN
    const currency = Currency.parse('USD');

    // WHEN
    const str = currency.toString();

    // THEN
    expect(str).toBe(currency.code);
  });

  it('should throw an error when parsing empty string', () => {
    expect(() => Currency.parse('')).toThrowError(InvalidCurrencyException);
  });
});

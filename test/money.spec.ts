import { Money, MoneyException, MoneyParseException } from '../src/money';
import { Currency, InvalidCurrencyException } from '../src/currency';

describe('money', () => {
  describe('Money object instantiation', () => {
    it('should create a Money instance with a valid amount and currency', () => {
      // GIVEN
      const amount = 1025;

      // WHEN
      const money = new Money(amount, Currency.parse('EUR'));

      // THEN
      expect(money).toBeDefined();
      expect(money.toString()).toBe('10.25 EUR');
    });

    it('should not create a Money instance if an amount greater than MAX_SAFE_INTEGER is given', () => {
      // GIVEN
      const euro = Currency.parse('EUR');
      const unsafeAmount = Number.MAX_SAFE_INTEGER + 1;

      // WHEN
      const newMoneyFunc = () => new Money(unsafeAmount, euro);

      // THEN
      expect(newMoneyFunc).toThrowError(MoneyException);
      expect(newMoneyFunc).toThrowError('Unsafe integer amount!');
    });

    it('should not create a Money instance if an amount less than MIN_SAFE_INTEGER is given', () => {
      // GIVEN
      const euro = Currency.parse('EUR');
      const unsafeAmount = Number.MIN_SAFE_INTEGER - 1;

      // WHEN
      const newMoneyFunc = () => new Money(unsafeAmount, euro);

      // THEN
      expect(newMoneyFunc).toThrowError(MoneyException);
      expect(newMoneyFunc).toThrowError('Unsafe integer amount!');
    });
  });

  describe('Money parsing from a string', () => {
    it('should parse Money from a string', () => {
      // GIVEN
      const moneyToParse = '45.98 EUR';

      // WHEN
      const money = Money.parse(moneyToParse);

      // THEN
      expect(money).toBeDefined();
      expect(money.toString()).toBe('45.98 EUR');
    });

    it('should not parse a money string with invalid amount', () => {
      // GIVEN
      const moneyToParse = 'Aas EUR';

      // WHEN
      const parseMoneyFunc = () => Money.parse(moneyToParse);

      // THEN
      expect(parseMoneyFunc).toThrowError(MoneyParseException);
    });

    it('should not parse a money string with invalid currency', () => {
      // GIVEN
      const moneyToParse = '10.76 ABC';

      // WHEN
      const parseMoneyFunc = () => Money.parse(moneyToParse);

      // THEN
      expect(parseMoneyFunc).toThrowError(InvalidCurrencyException);
    });
  });

  describe('Money object representation', () => {
    it('should convert a Money instance to a JSON representation', () => {
      // GIVEN
      const dollar = Currency.parse('USD');
      const money = new Money(12345, dollar);

      // WHEN
      const json = money.toJSON();

      // THEN
      expect(json.amount).toBe(12345);
      expect(json.currency).toBe('USD');
      expect(json.precision).toBe(dollar.exponent);
      expect(json.raw).toBe('123.45 USD');
    });
  });

  describe('Has same currency', () => {
    it('should return true when calling hasSameCurrency() for money with same currency', () => {
      // GIVEN
      const money1 = Money.parse('10.34 EUR');
      const money2 = Money.parse('375.99 EUR');

      // WHEN
      const isSameCurrency = money1.hasSameCurrency(money2);

      // THEN
      expect(isSameCurrency).toBe(true);
    });

    it('should return false when calling hasSameCurrency() for money with different currencies', () => {
      // GIVEN
      const money1 = Money.parse('87.34 EUR');
      const money2 = Money.parse('37.99 USD');

      // WHEN
      const isSameCurrency = money1.hasSameCurrency(money2);

      // THEN
      expect(isSameCurrency).toBe(false);
    });

    it('should return false when calling hasSameCurrency() for money with same amount and different currencies', () => {
      // GIVEN
      const money1 = Money.parse('87.34 EUR');
      const money2 = Money.parse('87.34 USD');

      // WHEN
      const isSameCurrency = money1.hasSameCurrency(money2);

      // THEN
      expect(isSameCurrency).toBe(false);
    });
  });

  describe('Comparing two money objects', () => {});
});

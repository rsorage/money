import { Currency } from './currency';

interface MoneyRepresentation {
  amount: number;
  currency: string;
  raw: string;
  precision: number;
}

/**
 * Class representing a monetary value in a specific currency.
 */
export class Money {
  private readonly amount: number;
  private readonly currency: Currency;

  /**
   * Creates an instance of Money.
   *
   * @param amount - The amount of money.
   * @param currency - The currency of the money.
   * @throws {MoneyException} Throws an exception if the amount is not a safe integer.
   */
  constructor(amount: number, currency: Currency) {
    if (amount > Number.MAX_SAFE_INTEGER || amount < Number.MIN_SAFE_INTEGER) {
      throw new MoneyException('Unsafe integer amount!');
    }

    this.amount = amount;
    this.currency = currency;
  }

  /**
   * Determines if two instances of {@link Money} have the same {@link Currency}.
   *
   * @param other The other {@link Money} instance to compare against.
   * @return `true` if both {@link Money} instances have the same {@link Currency}, `false` otherwise.
   * @throws MoneyException if the {@link Currency} comparison cannot be performed.
   */
  hasSameCurrency(other: Money): boolean {
    return this.currency.equals(other.currency);
  }

  /**
   * Compares this {@link Money} instance with another.
   *
   * @param other The other {@link Money} instance to compare against.
   * @return A number representing the difference in amount between this {@link Money} instance and the other.
   *         A positive number if this amount is greater, negative if less, and zero if equal.
   * @throws MoneyException if the two {@link Money} instances have different [Currencies]{@link Currency}.
   */
  compareTo(other: Money): number {
    if (!this.hasSameCurrency(other)) {
      throw new MoneyException('Impossible to compare monetary values with different currencies.');
    }

    return this.amount - other.amount;
  }

  /**
   * Checks if this {@link Money} instance is greater than another.
   *
   * @param other The other {@link Money} instance to compare against.
   * @return `true` if this {@link Money} instance is greater than the other, `false` otherwise.
   * @throws MoneyException if the two {@link Money} instances have different [Currencies]{@link Currency}.
   */
  isGreaterThan(other: Money): boolean {
    return this.compareTo(other) > 0;
  }

  /**
   * Checks if this {@link Money} instance is less than another.
   *
   * @param other The other {@link Money} instance to compare against.
   * @return `true` if this {@link Money} instance is less than the other, `false` otherwise.
   * @throws MoneyException if the two {@link Money} instances have different [Currencies]{@link Currency}.
   */
  isLessThan(other: Money): boolean {
    return this.compareTo(other) < 0;
  }

  /**
   * Checks if this {@link Money} instance is equal to another.
   *
   * @param other The other {@link Money} instance to compare against.
   * @return `true` if this {@link Money} instance is equal to the other, `false` otherwise.
   * @throws MoneyException if the two {@link Money} instances have different [Currencies]{@link Currency}.
   */
  equals(other: Money): boolean {
    return this.compareTo(other) === 0;
  }

  /**
   * Converts the {@link Money} instance to a JSON representation.
   *
   * @returns {MoneyRepresentation} The JSON representation of the {@link Money} instance.
   * @example
   * {
   *    amount: 1034,
   *    currency: "EUR",
   *    precision: 2,
   *    raw: "10.34 EUR"
   * }
   */
  toJSON(): MoneyRepresentation {
    return {
      amount: this.amount,
      currency: this.currency.code,
      precision: this.currency.exponent,
      raw: this.toString(),
    };
  }

  /**
   * Returns a string representation of the Money instance.
   *
   * @returns {string} The string representation of the Money instance.
   * @example
   *    const EUR = Currencies.parse("EUR");
   *    const money = new Money(1034, EUR);
   *    money.toString(); // "10.34 EUR"
   */
  toString(): string {
    const amountInDecimal = this.convertAmountToDecimal();
    const amountWithDecimalPlaces = amountInDecimal.toFixed(this.currency.exponent);

    return `${amountWithDecimalPlaces} ${this.currency.code}`;
  }

  /**
   * Parses a string to create an instance of Money.
   *
   * @param text - The string to parse.
   * @returns A new instance of Money.
   * @throws {MoneyParseException} Throws an exception if the string cannot be parsed into a Money instance.
   * @example
   *    Money.parse("13.99 EUR");
   */
  static parse(text: string): Money {
    const [amountStr, currencyStr] = text.split(' ');

    const currency = Currency.parse(currencyStr);
    const amount = parseFloat(amountStr) * currency.base ** currency.exponent;

    if (isNaN(amount)) {
      throw new MoneyParseException(text);
    }

    return new Money(Math.trunc(amount), currency);
  }

  /**
   * Converts the internal amount to a decimal based on the currency's base and exponent.
   *
   * @private
   * @returns {number} The amount as a decimal.
   * @example
   *    const money = new Money(1090, "EUR")
   *    // a call to convertAmountToDecimal() would return 10.9
   */
  private convertAmountToDecimal(): number {
    return this.amount / this.currency.base ** this.currency.exponent;
  }
}

/**
 * Represents an error related to the Money class operations.
 */
export class MoneyException extends Error {
  /**
   * Constructs a new MoneyException.
   *
   * @param [msg='MoneyError'] - The error message.
   * @example
   *    // Throwing a MoneyException with a custom message
   *    throw new MoneyException('Invalid currency code');
   */
  constructor(msg = 'MoneyError') {
    super(msg);
    this.name = this.constructor.name;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * Represents an error when parsing a string into a Money instance fails.
 */
export class MoneyParseException extends Error {
  /**
   * Constructs a new MoneyParseException.
   *
   * @param text - The input text that caused the parsing failure.
   * @example
   *    // Throwing a MoneyParseException when input text cannot be parsed
   *    throw new MoneyParseException('1234.56 XYZ');
   */
  constructor(text: string) {
    super(`Impossible to parse money: ${text}`);
    this.name = this.constructor.name;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

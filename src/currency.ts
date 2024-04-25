import { Currency as DineroCurrency } from '@dinero.js/currencies';
import * as currencies from '@dinero.js/currencies';

export class Currency {
  private readonly c: DineroCurrency<number>;

  private constructor(c: DineroCurrency<number>) {
    this.c = c;
  }

  get code(): string {
    return this.c.code;
  }

  get exponent(): number {
    return this.c.exponent;
  }

  get base(): number {
    return this.c.base;
  }

  equals(other: Currency) {
    return this.code === other.code;
  }

  toString(): string {
    return this.code;
  }

  static parse(code: string): Currency {
    const key = code as keyof typeof currencies;
    const c = currencies[key];

    if (!c) {
      throw new InvalidCurrencyException(code);
    }

    return new Currency(c);
  }
}

export class InvalidCurrencyException extends Error {
  constructor(code: string) {
    super(`Invalid currency: '${code}'`);
  }
}

# Money Library

A TypeScript library for handling monetary values with different currencies.

# Usage

## Currency Class

The Currency class represents a specific currency. It provides information about the currency code, exponent, and base.

### Example

```typescript

// Create a currency instance
const EUR = Currency.parse('EUR');

console.log(EUR.code); // 'EUR'
console.log(EUR.exponent); // 2
console.log(EUR.base); // 100
```

## Money Class

The Money class represents a monetary value in a specific currency. It allows you to perform comparisons, conversions,
and parsing.

### Example

```typescript
// Create a currency instance
const USD = Currency.parse('USD');

// Create a money instance
const amountInCents = 123456; // $1234.56
const money = new Money(amountInCents, USD);

console.log(money.toString()); // '1234.56 USD'

// Compare money instances
const otherMoney = new Money(100000, USD);
console.log(money.isGreaterThan(otherMoney)); // true
console.log(money.isLessThan(otherMoney)); // false
console.log(money.equals(otherMoney)); // false

// Parse a string into a Money instance
const parsedMoney = Money.parse('13.99 USD');
console.log(parsedMoney.toString()); // '13.99 USD'
```

## Exceptions

The library provides two custom exceptions:

- `MoneyException`: General error related to Money class operations.
- `MoneyParseException`: Error when parsing a string into a Money instance fails.

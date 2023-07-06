import JSBI from 'jsbi';
import invariant from 'tiny-invariant';
import _Decimal from 'decimal.js-light';
import _Big from 'big.js';
import toFormat from 'toformat';
import { getAddress } from '@ethersproject/address';

var TradeType;

(function (TradeType) {
  TradeType[TradeType["EXACT_INPUT"] = 0] = "EXACT_INPUT";
  TradeType[TradeType["EXACT_OUTPUT"] = 1] = "EXACT_OUTPUT";
})(TradeType || (TradeType = {}));

var Rounding;

(function (Rounding) {
  Rounding[Rounding["ROUND_DOWN"] = 0] = "ROUND_DOWN";
  Rounding[Rounding["ROUND_HALF_UP"] = 1] = "ROUND_HALF_UP";
  Rounding[Rounding["ROUND_UP"] = 2] = "ROUND_UP";
})(Rounding || (Rounding = {}));

var MaxUint256 = /*#__PURE__*/JSBI.BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;

  _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

var _toSignificantRoundin, _toFixedRounding;
var Decimal = /*#__PURE__*/toFormat(_Decimal);
var Big = /*#__PURE__*/toFormat(_Big);
var toSignificantRounding = (_toSignificantRoundin = {}, _toSignificantRoundin[Rounding.ROUND_DOWN] = Decimal.ROUND_DOWN, _toSignificantRoundin[Rounding.ROUND_HALF_UP] = Decimal.ROUND_HALF_UP, _toSignificantRoundin[Rounding.ROUND_UP] = Decimal.ROUND_UP, _toSignificantRoundin);
var toFixedRounding = (_toFixedRounding = {}, _toFixedRounding[Rounding.ROUND_DOWN] = 0, _toFixedRounding[Rounding.ROUND_HALF_UP] = 1, _toFixedRounding[Rounding.ROUND_UP] = 3, _toFixedRounding);
var Fraction = /*#__PURE__*/function () {
  function Fraction(numerator, denominator) {
    if (denominator === void 0) {
      denominator = JSBI.BigInt(1);
    }

    this.numerator = JSBI.BigInt(numerator);
    this.denominator = JSBI.BigInt(denominator);
  }

  Fraction.tryParseFraction = function tryParseFraction(fractionish) {
    if (fractionish instanceof JSBI || typeof fractionish === 'number' || typeof fractionish === 'string') return new Fraction(fractionish);
    if ('numerator' in fractionish && 'denominator' in fractionish) return fractionish;
    throw new Error('Could not parse fraction');
  } // performs floor division
  ;

  var _proto = Fraction.prototype;

  _proto.invert = function invert() {
    return new Fraction(this.denominator, this.numerator);
  };

  _proto.add = function add(other) {
    var otherParsed = Fraction.tryParseFraction(other);

    if (JSBI.equal(this.denominator, otherParsed.denominator)) {
      return new Fraction(JSBI.add(this.numerator, otherParsed.numerator), this.denominator);
    }

    return new Fraction(JSBI.add(JSBI.multiply(this.numerator, otherParsed.denominator), JSBI.multiply(otherParsed.numerator, this.denominator)), JSBI.multiply(this.denominator, otherParsed.denominator));
  };

  _proto.subtract = function subtract(other) {
    var otherParsed = Fraction.tryParseFraction(other);

    if (JSBI.equal(this.denominator, otherParsed.denominator)) {
      return new Fraction(JSBI.subtract(this.numerator, otherParsed.numerator), this.denominator);
    }

    return new Fraction(JSBI.subtract(JSBI.multiply(this.numerator, otherParsed.denominator), JSBI.multiply(otherParsed.numerator, this.denominator)), JSBI.multiply(this.denominator, otherParsed.denominator));
  };

  _proto.lessThan = function lessThan(other) {
    var otherParsed = Fraction.tryParseFraction(other);
    return JSBI.lessThan(JSBI.multiply(this.numerator, otherParsed.denominator), JSBI.multiply(otherParsed.numerator, this.denominator));
  };

  _proto.equalTo = function equalTo(other) {
    var otherParsed = Fraction.tryParseFraction(other);
    return JSBI.equal(JSBI.multiply(this.numerator, otherParsed.denominator), JSBI.multiply(otherParsed.numerator, this.denominator));
  };

  _proto.greaterThan = function greaterThan(other) {
    var otherParsed = Fraction.tryParseFraction(other);
    return JSBI.greaterThan(JSBI.multiply(this.numerator, otherParsed.denominator), JSBI.multiply(otherParsed.numerator, this.denominator));
  };

  _proto.multiply = function multiply(other) {
    var otherParsed = Fraction.tryParseFraction(other);
    return new Fraction(JSBI.multiply(this.numerator, otherParsed.numerator), JSBI.multiply(this.denominator, otherParsed.denominator));
  };

  _proto.divide = function divide(other) {
    var otherParsed = Fraction.tryParseFraction(other);
    return new Fraction(JSBI.multiply(this.numerator, otherParsed.denominator), JSBI.multiply(this.denominator, otherParsed.numerator));
  };

  _proto.toSignificant = function toSignificant(significantDigits, format, rounding) {
    if (format === void 0) {
      format = {
        groupSeparator: ''
      };
    }

    if (rounding === void 0) {
      rounding = Rounding.ROUND_HALF_UP;
    }

    !Number.isInteger(significantDigits) ? process.env.NODE_ENV !== "production" ? invariant(false, significantDigits + " is not an integer.") : invariant(false) : void 0;
    !(significantDigits > 0) ? process.env.NODE_ENV !== "production" ? invariant(false, significantDigits + " is not positive.") : invariant(false) : void 0;
    Decimal.set({
      precision: significantDigits + 1,
      rounding: toSignificantRounding[rounding]
    });
    var quotient = new Decimal(this.numerator.toString()).div(this.denominator.toString()).toSignificantDigits(significantDigits);
    return quotient.toFormat(quotient.decimalPlaces(), format);
  };

  _proto.toFixed = function toFixed(decimalPlaces, format, rounding) {
    if (format === void 0) {
      format = {
        groupSeparator: ''
      };
    }

    if (rounding === void 0) {
      rounding = Rounding.ROUND_HALF_UP;
    }

    !Number.isInteger(decimalPlaces) ? process.env.NODE_ENV !== "production" ? invariant(false, decimalPlaces + " is not an integer.") : invariant(false) : void 0;
    !(decimalPlaces >= 0) ? process.env.NODE_ENV !== "production" ? invariant(false, decimalPlaces + " is negative.") : invariant(false) : void 0;
    Big.DP = decimalPlaces;
    Big.RM = toFixedRounding[rounding];
    return new Big(this.numerator.toString()).div(this.denominator.toString()).toFormat(decimalPlaces, format);
  }
  /**
   * Helper method for converting any super class back to a fraction
   */
  ;

  _createClass(Fraction, [{
    key: "quotient",
    get: function get() {
      return JSBI.divide(this.numerator, this.denominator);
    } // remainder after floor division

  }, {
    key: "remainder",
    get: function get() {
      return new Fraction(JSBI.remainder(this.numerator, this.denominator), this.denominator);
    }
  }, {
    key: "asFraction",
    get: function get() {
      return new Fraction(this.numerator, this.denominator);
    }
  }]);

  return Fraction;
}();

var Big$1 = /*#__PURE__*/toFormat(_Big);
var CurrencyAmount = /*#__PURE__*/function (_Fraction) {
  _inheritsLoose(CurrencyAmount, _Fraction);

  function CurrencyAmount(currency, numerator, denominator) {
    var _this;

    _this = _Fraction.call(this, numerator, denominator) || this;
    !JSBI.lessThanOrEqual(_this.quotient, MaxUint256) ? process.env.NODE_ENV !== "production" ? invariant(false, 'AMOUNT') : invariant(false) : void 0;
    _this.currency = currency;
    _this.decimalScale = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(currency.decimals));
    return _this;
  }
  /**
   * Returns a new currency amount instance from the unitless amount of token, i.e. the raw amount
   * @param currency the currency in the amount
   * @param rawAmount the raw token or ether amount
   */


  CurrencyAmount.fromRawAmount = function fromRawAmount(currency, rawAmount) {
    return new CurrencyAmount(currency, rawAmount);
  }
  /**
   * Construct a currency amount with a denominator that is not equal to 1
   * @param currency the currency
   * @param numerator the numerator of the fractional token amount
   * @param denominator the denominator of the fractional token amount
   */
  ;

  CurrencyAmount.fromFractionalAmount = function fromFractionalAmount(currency, numerator, denominator) {
    return new CurrencyAmount(currency, numerator, denominator);
  };

  var _proto = CurrencyAmount.prototype;

  _proto.add = function add(other) {
    !this.currency.equals(other.currency) ? process.env.NODE_ENV !== "production" ? invariant(false, 'CURRENCY') : invariant(false) : void 0;

    var added = _Fraction.prototype.add.call(this, other);

    return CurrencyAmount.fromFractionalAmount(this.currency, added.numerator, added.denominator);
  };

  _proto.subtract = function subtract(other) {
    !this.currency.equals(other.currency) ? process.env.NODE_ENV !== "production" ? invariant(false, 'CURRENCY') : invariant(false) : void 0;

    var subtracted = _Fraction.prototype.subtract.call(this, other);

    return CurrencyAmount.fromFractionalAmount(this.currency, subtracted.numerator, subtracted.denominator);
  };

  _proto.multiply = function multiply(other) {
    var multiplied = _Fraction.prototype.multiply.call(this, other);

    return CurrencyAmount.fromFractionalAmount(this.currency, multiplied.numerator, multiplied.denominator);
  };

  _proto.divide = function divide(other) {
    var divided = _Fraction.prototype.divide.call(this, other);

    return CurrencyAmount.fromFractionalAmount(this.currency, divided.numerator, divided.denominator);
  };

  _proto.toSignificant = function toSignificant(significantDigits, format, rounding) {
    if (significantDigits === void 0) {
      significantDigits = 6;
    }

    if (rounding === void 0) {
      rounding = Rounding.ROUND_DOWN;
    }

    return _Fraction.prototype.divide.call(this, this.decimalScale).toSignificant(significantDigits, format, rounding);
  };

  _proto.toFixed = function toFixed(decimalPlaces, format, rounding) {
    if (decimalPlaces === void 0) {
      decimalPlaces = this.currency.decimals;
    }

    if (rounding === void 0) {
      rounding = Rounding.ROUND_DOWN;
    }

    !(decimalPlaces <= this.currency.decimals) ? process.env.NODE_ENV !== "production" ? invariant(false, 'DECIMALS') : invariant(false) : void 0;
    return _Fraction.prototype.divide.call(this, this.decimalScale).toFixed(decimalPlaces, format, rounding);
  };

  _proto.toExact = function toExact(format) {
    if (format === void 0) {
      format = {
        groupSeparator: ''
      };
    }

    Big$1.DP = this.currency.decimals;
    return new Big$1(this.quotient.toString()).div(this.decimalScale.toString()).toFormat(format);
  };

  _createClass(CurrencyAmount, [{
    key: "wrapped",
    get: function get() {
      if (this.currency.isToken) return this;
      return CurrencyAmount.fromFractionalAmount(this.currency.wrapped, this.numerator, this.denominator);
    }
  }]);

  return CurrencyAmount;
}(Fraction);

var TokenAmount = /*#__PURE__*/function (_CurrencyAmount) {
  _inheritsLoose(TokenAmount, _CurrencyAmount);

  function TokenAmount() {
    return _CurrencyAmount.apply(this, arguments) || this;
  }

  return TokenAmount;
}(CurrencyAmount);

var ONE_HUNDRED = /*#__PURE__*/new Fraction( /*#__PURE__*/JSBI.BigInt(100));
/**
 * Converts a fraction to a percent
 * @param fraction the fraction to convert
 */

function toPercent(fraction) {
  return new Percent(fraction.numerator, fraction.denominator);
}

var Percent = /*#__PURE__*/function (_Fraction) {
  _inheritsLoose(Percent, _Fraction);

  function Percent() {
    var _this;

    _this = _Fraction.apply(this, arguments) || this;
    /**
     * This boolean prevents a fraction from being interpreted as a Percent
     */

    _this.isPercent = true;
    return _this;
  }

  var _proto = Percent.prototype;

  _proto.add = function add(other) {
    return toPercent(_Fraction.prototype.add.call(this, other));
  };

  _proto.subtract = function subtract(other) {
    return toPercent(_Fraction.prototype.subtract.call(this, other));
  };

  _proto.multiply = function multiply(other) {
    return toPercent(_Fraction.prototype.multiply.call(this, other));
  };

  _proto.divide = function divide(other) {
    return toPercent(_Fraction.prototype.divide.call(this, other));
  };

  _proto.toSignificant = function toSignificant(significantDigits, format, rounding) {
    if (significantDigits === void 0) {
      significantDigits = 5;
    }

    return _Fraction.prototype.multiply.call(this, ONE_HUNDRED).toSignificant(significantDigits, format, rounding);
  };

  _proto.toFixed = function toFixed(decimalPlaces, format, rounding) {
    if (decimalPlaces === void 0) {
      decimalPlaces = 2;
    }

    return _Fraction.prototype.multiply.call(this, ONE_HUNDRED).toFixed(decimalPlaces, format, rounding);
  };

  return Percent;
}(Fraction);

var Price = /*#__PURE__*/function (_Fraction) {
  _inheritsLoose(Price, _Fraction);

  /**
   * Construct a price, either with the base and quote currency amount, or the
   * @param args
   */
  function Price() {
    var _this;

    var baseCurrency, quoteCurrency, denominator, numerator;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    if (args.length === 4) {
      baseCurrency = args[0];
      quoteCurrency = args[1];
      denominator = args[2];
      numerator = args[3];
    } else {
      var result = args[0].quoteAmount.divide(args[0].baseAmount);
      var _ref = [args[0].baseAmount.currency, args[0].quoteAmount.currency, result.denominator, result.numerator];
      baseCurrency = _ref[0];
      quoteCurrency = _ref[1];
      denominator = _ref[2];
      numerator = _ref[3];
    }

    _this = _Fraction.call(this, numerator, denominator) || this;
    _this.baseCurrency = baseCurrency;
    _this.quoteCurrency = quoteCurrency;
    _this.scalar = new Fraction(JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(baseCurrency.decimals)), JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(quoteCurrency.decimals)));
    return _this;
  }
  /**
   * Flip the price, switching the base and quote currency
   */


  var _proto = Price.prototype;

  _proto.invert = function invert() {
    return new Price(this.quoteCurrency, this.baseCurrency, this.numerator, this.denominator);
  }
  /**
   * Multiply the price by another price, returning a new price. The other price must have the same base currency as this price's quote currency
   * @param other the other price
   */
  ;

  _proto.multiply = function multiply(other) {
    !this.quoteCurrency.equals(other.baseCurrency) ? process.env.NODE_ENV !== "production" ? invariant(false, 'TOKEN') : invariant(false) : void 0;

    var fraction = _Fraction.prototype.multiply.call(this, other);

    return new Price(this.baseCurrency, other.quoteCurrency, fraction.denominator, fraction.numerator);
  }
  /**
   * Return the amount of quote currency corresponding to a given amount of the base currency
   * @param currencyAmount the amount of base currency to quote against the price
   */
  ;

  _proto.quote = function quote(currencyAmount) {
    !currencyAmount.currency.equals(this.baseCurrency) ? process.env.NODE_ENV !== "production" ? invariant(false, 'TOKEN') : invariant(false) : void 0;

    var result = _Fraction.prototype.multiply.call(this, currencyAmount);

    return CurrencyAmount.fromFractionalAmount(this.quoteCurrency, result.numerator, result.denominator);
  }
  /**
   * Get the value scaled by decimals for formatting
   * @private
   */
  ;

  _proto.toSignificant = function toSignificant(significantDigits, format, rounding) {
    if (significantDigits === void 0) {
      significantDigits = 6;
    }

    return this.adjustedForDecimals.toSignificant(significantDigits, format, rounding);
  };

  _proto.toFixed = function toFixed(decimalPlaces, format, rounding) {
    if (decimalPlaces === void 0) {
      decimalPlaces = 4;
    }

    return this.adjustedForDecimals.toFixed(decimalPlaces, format, rounding);
  };

  _createClass(Price, [{
    key: "adjustedForDecimals",
    get: function get() {
      return _Fraction.prototype.multiply.call(this, this.scalar);
    }
  }]);

  return Price;
}(Fraction);

/**
 * A currency is any fungible financial instrument, including Ether, all ERC20 tokens, and other chain-native currencies
 */

var BaseCurrency =
/**
 * Constructs an instance of the base class `BaseCurrency`.
 * @param chainId the chain ID on which this currency resides
 * @param decimals decimals of the currency
 * @param symbol symbol of the currency
 * @param name of the currency
 */
function BaseCurrency(chainId, decimals, symbol, name) {
  !Number.isSafeInteger(chainId) ? process.env.NODE_ENV !== "production" ? invariant(false, 'CHAIN_ID') : invariant(false) : void 0;
  !(decimals >= 0 && decimals < 255 && Number.isInteger(decimals)) ? process.env.NODE_ENV !== "production" ? invariant(false, 'DECIMALS') : invariant(false) : void 0;
  this.chainId = chainId;
  this.decimals = decimals;
  this.symbol = symbol;
  this.name = name;
};

/**
 * Represents the native currency of the chain on which it resides, e.g.
 */

var NativeCurrency = /*#__PURE__*/function (_BaseCurrency) {
  _inheritsLoose(NativeCurrency, _BaseCurrency);

  function NativeCurrency() {
    var _this;

    _this = _BaseCurrency.apply(this, arguments) || this;
    _this.isNative = true;
    _this.isToken = false;
    return _this;
  }

  return NativeCurrency;
}(BaseCurrency);

/**
 * Validates an address and returns the parsed (checksummed) version of that address
 * @param address the unchecksummed hex address
 */

function validateAndParseAddress(address) {
  try {
    return getAddress(address);
  } catch (error) {
    throw new Error(address + " is not a valid address.");
  }
}

/**
 * Represents an ERC20 token with a unique address and some metadata.
 */

var Token = /*#__PURE__*/function (_BaseCurrency) {
  _inheritsLoose(Token, _BaseCurrency);

  function Token(chainId, address, decimals, symbol, name) {
    var _this;

    _this = _BaseCurrency.call(this, chainId, decimals, symbol, name) || this;
    _this.isNative = false;
    _this.isToken = true;
    _this.address = validateAndParseAddress(address);
    return _this;
  }
  /**
   * Returns true if the two tokens are equivalent, i.e. have the same chainId and address.
   * @param other other token to compare
   */


  var _proto = Token.prototype;

  _proto.equals = function equals(other) {
    return other.isToken && this.chainId === other.chainId && this.address === other.address;
  }
  /**
   * Returns true if the address of this token sorts before the address of the other token
   * @param other other token to compare
   * @throws if the tokens have the same address
   * @throws if the tokens are on different chains
   */
  ;

  _proto.sortsBefore = function sortsBefore(other) {
    !(this.chainId === other.chainId) ? process.env.NODE_ENV !== "production" ? invariant(false, 'CHAIN_IDS') : invariant(false) : void 0;
    !(this.address !== other.address) ? process.env.NODE_ENV !== "production" ? invariant(false, 'ADDRESSES') : invariant(false) : void 0;
    return this.address.toLowerCase() < other.address.toLowerCase();
  }
  /**
   * Return this token, which does not need to be wrapped
   */
  ;

  _createClass(Token, [{
    key: "wrapped",
    get: function get() {
      return this;
    }
  }]);

  return Token;
}(BaseCurrency);

var _WETH;
var ChainId;

(function (ChainId) {
  ChainId[ChainId["MAINNET"] = 1] = "MAINNET";
  ChainId[ChainId["ROPSTEN"] = 3] = "ROPSTEN";
  ChainId[ChainId["RINKEBY"] = 4] = "RINKEBY";
  ChainId[ChainId["G\xD6RLI"] = 5] = "G\xD6RLI";
  ChainId[ChainId["KOVAN"] = 42] = "KOVAN";
  ChainId[ChainId["MATIC"] = 137] = "MATIC";
  ChainId[ChainId["MUMBAI"] = 80001] = "MUMBAI";
  ChainId[ChainId["BSCTESTNET"] = 97] = "BSCTESTNET";
  ChainId[ChainId["BSCMAINNET"] = 56] = "BSCMAINNET";
  ChainId[ChainId["AVAXTESTNET"] = 43113] = "AVAXTESTNET";
  ChainId[ChainId["AVAXMAINNET"] = 43114] = "AVAXMAINNET";
  ChainId[ChainId["FANTOM"] = 250] = "FANTOM";
  ChainId[ChainId["CRONOSTESTNET"] = 338] = "CRONOSTESTNET";
  ChainId[ChainId["CRONOS"] = 25] = "CRONOS";
  ChainId[ChainId["ARBITRUM"] = 42161] = "ARBITRUM";
  ChainId[ChainId["ARBITRUM_TESTNET"] = 421611] = "ARBITRUM_TESTNET";
  ChainId[ChainId["BTTC"] = 199] = "BTTC";
  ChainId[ChainId["VELAS"] = 106] = "VELAS";
  ChainId[ChainId["AURORA"] = 1313161554] = "AURORA";
  ChainId[ChainId["OASIS"] = 42262] = "OASIS";
  ChainId[ChainId["OPTIMISM"] = 10] = "OPTIMISM";
  ChainId[ChainId["ETHW"] = 10001] = "ETHW";
  ChainId[ChainId["ZKSYNCTESTNET"] = 280] = "ZKSYNCTESTNET";
  ChainId[ChainId["ZKSYNC"] = 324] = "ZKSYNC";
})(ChainId || (ChainId = {}));

var WETH = (_WETH = {}, _WETH[ChainId.MAINNET] = /*#__PURE__*/new Token(ChainId.MAINNET, '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', 18, 'WETH', 'Wrapped Ether'), _WETH[ChainId.ETHW] = /*#__PURE__*/new Token(ChainId.ETHW, '0x7Bf88d2c0e32dE92CdaF2D43CcDc23e8Edfd5990', 18, 'WETHW', 'Wrapped ETHPoW'), _WETH[ChainId.ROPSTEN] = /*#__PURE__*/new Token(ChainId.ROPSTEN, '0xc778417E063141139Fce010982780140Aa0cD5Ab', 18, 'WETH', 'Wrapped Ether'), _WETH[ChainId.RINKEBY] = /*#__PURE__*/new Token(ChainId.RINKEBY, '0xc778417E063141139Fce010982780140Aa0cD5Ab', 18, 'WETH', 'Wrapped Ether'), _WETH[ChainId.GÖRLI] = /*#__PURE__*/new Token(ChainId.GÖRLI, '0x48f6D7dAE56623Dde5a0D56B283165cAE1753D70', 18, 'WETH', 'Wrapped Ether'), _WETH[ChainId.KOVAN] = /*#__PURE__*/new Token(ChainId.KOVAN, '0xd0A1E359811322d97991E03f863a0C30C2cF029C', 18, 'WETH', 'Wrapped Ether'), _WETH[ChainId.MATIC] = /*#__PURE__*/new Token(ChainId.MATIC, '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270', 18, 'WMATIC', 'Wrapped Matic'), _WETH[ChainId.MUMBAI] = /*#__PURE__*/new Token(ChainId.MUMBAI, '0x19395624C030A11f58e820C3AeFb1f5960d9742a', 18, 'WMATIC', 'Wrapped Matic'), _WETH[ChainId.BSCTESTNET] = /*#__PURE__*/new Token(ChainId.BSCTESTNET, '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd', 18, 'WBNB', 'Wrapped BNB'), _WETH[ChainId.BSCMAINNET] = /*#__PURE__*/new Token(ChainId.BSCMAINNET, '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', 18, 'WBNB', 'Wrapped BNB'), _WETH[ChainId.AVAXTESTNET] = /*#__PURE__*/new Token(ChainId.AVAXTESTNET, '0x1D308089a2D1Ced3f1Ce36B1FcaF815b07217be3', 18, 'WAVAX', 'Wrapped AVAX'), _WETH[ChainId.AVAXMAINNET] = /*#__PURE__*/new Token(ChainId.AVAXMAINNET, '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7', 18, 'WAVAX', 'Wrapped AVAX'), _WETH[ChainId.FANTOM] = /*#__PURE__*/new Token(ChainId.FANTOM, '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83', 18, 'WFTM', 'Wrapped Fantom'), _WETH[ChainId.CRONOSTESTNET] = /*#__PURE__*/new Token(ChainId.CRONOSTESTNET, '0x1A46dCaC1d91F1731574BEfAEDaC4E0392726e35', 18, 'WCRO', 'Wrapped CRO'), _WETH[ChainId.CRONOS] = /*#__PURE__*/new Token(ChainId.CRONOS, '0x5C7F8A570d578ED84E63fdFA7b1eE72dEae1AE23', 18, 'WCRO', 'Wrapped CRO'), _WETH[ChainId.ARBITRUM] = /*#__PURE__*/new Token(ChainId.ARBITRUM, '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1', 18, 'WETH', 'Wrapped Ether'), _WETH[ChainId.ARBITRUM_TESTNET] = /*#__PURE__*/new Token(ChainId.ARBITRUM_TESTNET, '0xB47e6A5f8b33b3F17603C83a0535A9dcD7E32681', 18, 'WETH', 'Wrapped Ether'), _WETH[ChainId.BTTC] = /*#__PURE__*/new Token(ChainId.BTTC, '0x8D193c6efa90BCFf940A98785d1Ce9D093d3DC8A', 18, 'WBTT', 'Wrapped BitTorrent'), _WETH[ChainId.VELAS] = /*#__PURE__*/new Token(ChainId.VELAS, '0xc579D1f3CF86749E05CD06f7ADe17856c2CE3126', 18, 'WVLX', 'Wrapped VLX'), _WETH[ChainId.AURORA] = /*#__PURE__*/new Token(ChainId.AURORA, '0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB', 18, 'WETH', 'Wrapped ETH'), _WETH[ChainId.OASIS] = /*#__PURE__*/new Token(ChainId.OASIS, '0x21C718C22D52d0F3a789b752D4c2fD5908a8A733', 18, 'WROSE', 'Wrapped ROSE'), _WETH[ChainId.OPTIMISM] = /*#__PURE__*/new Token(ChainId.OPTIMISM, '0x4200000000000000000000000000000000000006', 18, 'WETH', 'Wrapped Ether'), _WETH[ChainId.ZKSYNCTESTNET] = /*#__PURE__*/new Token(ChainId.ZKSYNCTESTNET, '0x33F1FBe337A19BebCa41a3DCbA896752729286Ea', 18, 'WETH', 'Wrapped ETH'), _WETH[ChainId.ZKSYNC] = /*#__PURE__*/new Token(ChainId.ZKSYNC, '0x5aea5775959fbc2557cc8789bc1bf90a239d9a91', 18, 'WETH', 'Wrapped ETH'), _WETH);

/**
 * Ether is the main usage of a 'native' currency, i.e. for Ethereum mainnet and all testnets
 */

var Ether = /*#__PURE__*/function (_NativeCurrency) {
  _inheritsLoose(Ether, _NativeCurrency);

  function Ether(chainId) {
    return _NativeCurrency.call(this, chainId, 18, 'ETH', 'Ether') || this;
  }

  Ether.onChain = function onChain(chainId) {
    var _this$_etherCache$cha;

    return (_this$_etherCache$cha = this._etherCache[chainId]) != null ? _this$_etherCache$cha : this._etherCache[chainId] = new Ether(chainId);
  };

  var _proto = Ether.prototype;

  _proto.equals = function equals(other) {
    return other.isNative && other.chainId === this.chainId;
  };

  _createClass(Ether, [{
    key: "wrapped",
    get: function get() {
      var weth9 = WETH[this.chainId];
      !!!weth9 ? process.env.NODE_ENV !== "production" ? invariant(false, 'WRAPPED') : invariant(false) : void 0;
      return weth9;
    }
  }]);

  return Ether;
}(NativeCurrency);
Ether._etherCache = {};

/**
 * Returns the percent difference between the mid price and the execution price, i.e. price impact.
 * @param midPrice mid price before the trade
 * @param inputAmount the input amount of the trade
 * @param outputAmount the output amount of the trade
 */

function computePriceImpact(midPrice, inputAmount, outputAmount) {
  var quotedOutputAmount = midPrice.quote(inputAmount); // calculate price impact := (exactQuote - outputAmount) / exactQuote

  var priceImpact = quotedOutputAmount.subtract(outputAmount).divide(quotedOutputAmount);
  return new Percent(priceImpact.numerator, priceImpact.denominator);
}

// `maxSize` by removing the last item

function sortedInsert(items, add, maxSize, comparator) {
  !(maxSize > 0) ? process.env.NODE_ENV !== "production" ? invariant(false, 'MAX_SIZE_ZERO') : invariant(false) : void 0; // this is an invariant because the interface cannot return multiple removed items if items.length exceeds maxSize

  !(items.length <= maxSize) ? process.env.NODE_ENV !== "production" ? invariant(false, 'ITEMS_SIZE') : invariant(false) : void 0; // short circuit first item add

  if (items.length === 0) {
    items.push(add);
    return null;
  } else {
    var isFull = items.length === maxSize; // short circuit if full and the additional item does not come before the last item

    if (isFull && comparator(items[items.length - 1], add) <= 0) {
      return add;
    }

    var lo = 0,
        hi = items.length;

    while (lo < hi) {
      var mid = lo + hi >>> 1;

      if (comparator(items[mid], add) <= 0) {
        lo = mid + 1;
      } else {
        hi = mid;
      }
    }

    items.splice(lo, 0, add);
    return isFull ? items.pop() : null;
  }
}

var MAX_SAFE_INTEGER = /*#__PURE__*/JSBI.BigInt(Number.MAX_SAFE_INTEGER);
var ZERO = /*#__PURE__*/JSBI.BigInt(0);
var ONE = /*#__PURE__*/JSBI.BigInt(1);
var TWO = /*#__PURE__*/JSBI.BigInt(2);
/**
 * Computes floor(sqrt(value))
 * @param value the value for which to compute the square root, rounded down
 */

function sqrt(value) {
  !JSBI.greaterThanOrEqual(value, ZERO) ? process.env.NODE_ENV !== "production" ? invariant(false, 'NEGATIVE') : invariant(false) : void 0; // rely on built in sqrt if possible

  if (JSBI.lessThan(value, MAX_SAFE_INTEGER)) {
    return JSBI.BigInt(Math.floor(Math.sqrt(JSBI.toNumber(value))));
  }

  var z;
  var x;
  z = value;
  x = JSBI.add(JSBI.divide(value, TWO), ONE);

  while (JSBI.lessThan(x, z)) {
    z = x;
    x = JSBI.divide(JSBI.add(JSBI.divide(value, x), x), TWO);
  }

  return z;
}

export { ChainId, CurrencyAmount, Ether, Fraction, MaxUint256, NativeCurrency, Percent, Price, Rounding, Token, TokenAmount, TradeType, WETH, computePriceImpact, sortedInsert, sqrt, validateAndParseAddress };
//# sourceMappingURL=ks-sdk-core.esm.js.map

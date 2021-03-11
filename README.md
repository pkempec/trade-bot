# Trade Bot
Interested in Crypto Trading?
Maybe you just found the quickest way how to loose all investment with cool automatic way!

The bot use 2 APIs:
1. [Binance API](https://binance-docs.github.io/apidocs/spot/en/#introduction) for trading
2. [Taapi API](https://taapi.io/documentation/integration/direct/) for getting various [Trade indicators](https://taapi.io/indicators/)

## Description
Bot that will 
1. check the Trade Indicator
2. get strategy based on actual Portfolio and Trade Indicator
3. Trade based on strategy

### Trade Indicator
Using https://taapi.io/ to get indicators like RSI, Fibonacci Retracement, ...
See documentation for all supported indicators https://taapi.io/indicators/

### Strategy
Check the actual porfolio
Apply the defined strategy.
Feel free to play with strategy.
See strategy.js

### Trade
Using Binance API to open trades.

Please notice there is used 'MARKET' ORDER which might be considered as risky. 

## Usage
1. SET API KEY in .env for 
- [TAAPI](https://taapi.io/) Free api key 
- [BINANCE](https://www.binance.com/en) -> Profile -> API management. Ensure binance key have rights to set trade (Enable Spot & Margin Trading, Enable Reading)
- CRYPTO - crypto what you want to trade
- STABLE - stable coin you want to use. Notice the binance must suppot trade crypto with selected stable coin
- INDICATOR - trending strategy, see taapi for available indicators
- INTERVAL - interval applied to indicator

```
TAAPI_API_KEY=[your taapi api key]
BINANCE_API_KEY=[your binance api key]
BINANCE_SECREY_KEY=[your binance secrey key]
CRYPTO=DOT
STABLE=BUSD
INDICATOR=rsi
INTERVAL=30m
```

2. start the trade bot

```bash
yarn start
```
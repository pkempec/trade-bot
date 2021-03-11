# Trade Bot
Interested in Crypto Trading?
Maybe you have just found the quickest way how to lose all investment with cool automatic way!

The bot use 2 APIs:
1. [Binance API](https://binance-docs.github.io/apidocs/spot/en/#introduction) for trading
2. [Taapi API](https://taapi.io/documentation/integration/direct/) for getting various [Trade indicators](https://taapi.io/indicators/)

## Description
Evaluation of Trade indicator is handled each 1 minute. See index.js cron rule.

1. Check the Trade Indicator
2. Check Wallet
3. Get strategy based on actual Portfolio and Trade Indicator
4. Trade based on strategy

### Trade Indicator
The current value of selected indicator. It comes from Taapi.

Using https://taapi.io/ to get indicators like RSI, Fibonacci Retracement, ...
See documentation for all supported indicators https://taapi.io/indicators/

### Wallet
Calls Binance to check wallet to optimize strategy.

#### Example

```json
{
    "crypto": {
        "symbol": "DOT",
        "value": 1.01,
        "estimateStable": 37.0001
    },
    "stable": {
        "symbol": "BUSD",
        "value": 63.0009,
        "estimateCrypto": 1.692722425074527
    },
    "fee": {
        "symbol": "BNB",
        "value": 0.00383236
    },
    "total": {
        "estimate": 100.001
    }
}
```

### Strategy
Check the actual porfolio.
Apply the defined strategy.
Feel free to play with strategy.
See strategy.js


#### Example
```js
const getStrategy = (indicator, wallet) => {
// code own strategy
// amonut is always value in stable coin eg. BUSD
// return { action: 'SELL', amount: 20};
// return { action: 'BUY', amount: 20};
// return { action: 'WAIT', amount: 20};
}
```

### Trade
Using Binance API to open trades.

Please notice there is used 'MARKET' ORDER which might be considered as risky. 

## Usage
0. Install (setup once) 
- [NodeJS](https://nodejs.org/en/)
- [Yarn](https://classic.yarnpkg.com/en/docs/install/)

1. Rename .env-sample to .env and SET API KEYs (setup once)
- [TAAPI](https://taapi.io/) Free api key 
- [BINANCE](https://www.binance.com/en) -> Profile -> API management. Ensure binance key have rights to set trade (Enable Spot & Margin Trading, Enable Reading)
- CRYPTO - crypto what you want to trade
- STABLE - stable coin you want to use. Notice the binance must suppot trade crypto with selected stable coin
- INDICATOR - trending strategy, see taapi for available indicators
- INTERVAL - interval applied to indicator

2. Ensure you have (setup once)
- CRYPTO or STABLE coin in wallet
- fraction of BNB coin for cheaper transaction fees

```
TAAPI_API_KEY=[your taapi api key]
BINANCE_API_KEY=[your binance api key]
BINANCE_SECREY_KEY=[your binance secrey key]
CRYPTO=DOT
STABLE=BUSD
INDICATOR=rsi
INTERVAL=30m
```
3. Install (setup once)
Run in project folder.

```bash
yarn install
```

4. Start the trade bot (each time you wisth to start bot)
Run in project folder.

```bash
yarn start
```
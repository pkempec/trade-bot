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
        "estimateStable": 37.0001,
        "askPrice": 37.73,
        "bidPrice": 37.71,
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
1. Install (setup once) 
    * [NodeJS](https://nodejs.org/en/)
    * [Yarn](https://classic.yarnpkg.com/en/docs/install/)

2. Rename .env-sample to .env and SET API KEYs (setup once)
    * [TAAPI](https://taapi.io/) Free api key 
    * [BINANCE](https://www.binance.com/en) -> Profile -> API management. Ensure binance key have rights to set trade (Enable Spot & Margin Trading, Enable Reading)
    * CRYPTO - crypto what you want to trade
    * STABLE - stable coin you want to use. Notice the binance must suppot trade crypto with selected stable coin
    * INDICATOR - trending strategy, see taapi for available indicators
    * INTERVAL - interval applied to indicator

3. Ensure you have (setup once)
    * CRYPTO or STABLE coin in wallet
    * fraction of BNB coin for cheaper transaction fees

```
TAAPI_API_KEY=[your taapi api key]
BINANCE_API_KEY=[your binance api key]
BINANCE_SECREY_KEY=[your binance secrey key]
CRYPTO=DOT
STABLE=BUSD
INDICATOR=rsi
INTERVAL=30m
```
4. Install (setup once)
Run in project folder.

```bash
yarn install
```

5. Start the trade bot (each time you wisth to start bot)
Run in project folder.

Start trading
```bash
yarn start-backend
```

Start UI to see data generated from backend
```bash
yarn start-frontend
```

#### Logs
Logs from backend are collected in different places

1. Trade logs are collected in frontend/src/data/trade-YYYY-MM-DD.log
2. Warning logs are collected in backend/warning.log
3. Error logs are collected in backend/error.log


## FAQ
Q1. I am getting "Timestamp for this request was 1000ms ahead of the server's time.".

A: Ensure your time is in sync. Try to synchronize your time manually.
1. Right click on windows clocks
2. Select "Adjust date/time"
3. Ensure you have enabled both "Set time automatically" and "Set time zone automatically"
3. Press "Sync now"
4. Check if error disapear

It it helps I recommend update windows registry to sync time more often.

This will set to sync time each 17min (1020 seconds)
1. Open Regedit
2. Navigate to HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\W32Time\TimeProviders\NtpClient
3. Adjust value SpecialPollInterval to 1020 as Decimal Value

Q2. I do not recieve value of indicator.

A: 
- Please ensure you have correct TAAPI key in .env file
- I have notices from time to time TAAPI have issues and do not sent correct response. This is usually fixed by TAAPI and it start to work normally in few minutes.

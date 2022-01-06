// const { getStrategy } = require('./strategies/rsi-v1');
// const { getStrategy } = require('./strategies/rsi-v2');
// const { getStrategy } = require('./strategies/rsi-v3');
const { getStrategy } = require('./strategies/rsi-v4');
// const { getStrategy } = require('./strategies/profit-v1');
const { logger } = require('./logger');
const fs = require('fs');
const path = require('path');

const initWallet = () => {
    return {"crypto":{"symbol":"DOT","value":3.93725,"estimateStable":122.53,"askPrice":31.14,"bidPrice":31.12},"stable":{"symbol":"BUSD","value":1.02,"estimateCrypto":0.03},"fee":{"symbol":"BNB","value":0.00377635},"total":{"estimate":123.55}};
}

const initFirstTrade = () => {
    return {"time":"2021.12.07 16:32:00","indicator":{"type":"rsi/1h","value":"73.22"},"wallet":initWallet(),"strategy":{"action":"SELL","amount":61.27,"level":2},"level":"info","message":"Stats"};
}

const cloneWallet = (wallet) => {
    return {...wallet, crypto: {...wallet.crypto}, stable: {...wallet.stable}, fee: {...wallet.fee}, total: {...wallet.total}};
} 

const trade = (strategy, point, wallet) => {
    const amount = strategy.amount;

    let result = cloneWallet(wallet);

    const askPrice = point.wallet.crypto.askPrice;
    const bidPrice = point.wallet.crypto.bidPrice;
    if (strategy.action === 'SELL') {
        const sellAmount = amount/bidPrice;
        result.crypto.value -= sellAmount;
        result.stable.value += amount;
    } else if (strategy.action === 'BUY') {
        const buyAmount = amount/askPrice;
        result.crypto.value += buyAmount;
        result.stable.value -= amount;
    }
    result.crypto.askPrice = askPrice;
    result.crypto.bidPrice = bidPrice;
    result.crypto.estimateStable = Number((Number(result.crypto.value) * Number(bidPrice)).toFixed(2));
    result.stable.estimateCrypto = Number((Number(result.stable.value) / Number(askPrice)).toFixed(2));
    result.total.estimate = result.stable.value + result.crypto.estimateStable;
    
    return result;
}

const loadData = () => {
    const dataFolder = './data';
    
    let data = [];

    fs.readdirSync(dataFolder).forEach(fileName => {
      const filePath = path.join(dataFolder, fileName);
      const text = fs.readFileSync(filePath).toString();
      const json = JSON.parse('[' + text.trim().replace(/,$/,'') + ']');
      data = [...data, ...json];
    });

    return data;
}

const updateOffers = (point, wallet) => {
    const askPrice = point.wallet.crypto.askPrice;
    const bidPrice = point.wallet.crypto.bidPrice;

    let result = cloneWallet(wallet);

    result.crypto.askPrice = askPrice;
    result.crypto.bidPrice = bidPrice;
    result.crypto.estimateStable = Number((Number(result.crypto.value) * Number(bidPrice)).toFixed(2));
    result.stable.estimateCrypto = Number((Number(result.stable.value) / Number(askPrice)).toFixed(2));
    result.total.estimate = result.stable.value + result.crypto.estimateStable;

    return result;
}

const simulate = () => {
    let lastTrade = initFirstTrade();
    const data = loadData();
    let wallet = initWallet(); 
    
    let counter = 0;
    for (let point of data) {
        const time = counter;
        if (point && point.indicator && point.indicator.value && point.wallet && point.wallet.crypto && point.wallet.crypto.value) {            
            const indicatorValue = Number(point.indicator.value);
            wallet = updateOffers(point, wallet);
            const strategy = getStrategy(indicatorValue, wallet, lastTrade);
            wallet = trade(strategy, point, wallet);
            
            const indicator = {
                value: (indicatorValue !== undefined ? indicatorValue.toFixed(2) : indicatorValue)
            }
            
            logger.info('Stats', {time, indicator, wallet, strategy});
            
            if (strategy.action != 'WAIT') {
                logger.log('trade', {time, indicator, wallet, strategy});
                lastTrade = {time, indicator, wallet: cloneWallet(wallet), strategy};
            }
            counter++;
        }
    }

}

simulate();
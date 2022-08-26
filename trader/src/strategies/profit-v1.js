/*
 Simple Profit strategy 
 SELL 98% of crypto when stable coin is in 5% profit since last trade
 BUY 98% of crypto when crypto coin is in 5% profit since last trade
 MIGHT GET STUCK - when coin never reach its tops/lows
*/

const { logger } = require('../logger');

const getStrategy = (indicator, wallet, lastTrade) => {
    if (wallet === undefined) {
        logger.warn('Strategy', { reason: 'Missing wallet'});
        return { action: 'WAIT', amount: 0, level: 0 };
    }
    if (wallet.fee.value <= 0) {
        logger.warn('Strategy', { reason: 'I am not trading without BNB for cheaper fees.'});
        return { action: 'WAIT', amount: 0, level: 0 };
    }

    if (isInStableProfit(wallet, lastTrade, 5)) {
        const invest = calculateInvestmentValue(wallet, 98, 'SELL');
        return { action: invest > 0 ? 'SELL' : 'WAIT', amount: invest, level: 1 };
    } else if (isInCryptoProfit(wallet, lastTrade, 5)) {
        const invest = calculateInvestmentValue(wallet, 98, 'BUY');
        return { action: invest > 0 ? 'BUY' : 'WAIT', amount: invest, level: 1 };
    } else {
        return { action: 'WAIT', amount: 0, level: 0 };
    }
}

const calculateInvestmentValue = (wallet, perc, action) => {
    let value = wallet.stable.value;
    if(action === 'SELL') {
        value = wallet.crypto.estimateStable;
    }
    const invest = (value / 100) * perc;
    if (invest < 11) {
        //usually there is limit and with such a fraction is not allowed to be traded
        // logger.warn('Strategy', { reason: 'Low Limit: '+ invest});
        return 0;
    }
    return Number(invest.toFixed(2));
}

const isInStableProfit = (wallet, lastTrade, desiredProfit) => {
    const current = wallet.crypto.estimateStable + wallet.stable.value;
    const previous = lastTrade.wallet.crypto.estimateStable + lastTrade.wallet.stable.value;
    return isInDesiredProfit(current, previous, desiredProfit);   
}

const isInCryptoProfit = (wallet, lastTrade, desiredProfit) => {
    const current = wallet.crypto.value + wallet.stable.estimateCrypto;
    const previous = lastTrade.wallet.crypto.value + lastTrade.wallet.stable.estimateCrypto;
    return isInDesiredProfit(current, previous, desiredProfit);
}

const isInDesiredProfit = (current, previous, desiredProfit) => {
    const currentProfit = ((current / previous) - 1) * 100;
    return currentProfit >= desiredProfit;
}

module.exports = {
    getStrategy: getStrategy,
};
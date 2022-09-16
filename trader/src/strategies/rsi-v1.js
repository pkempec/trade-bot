/*
 RSI strategy 
 SELL 98% of crypto when RSI reach value higher than 75
 SELL 50% of crypto when RSI is between 70 and 75 and crypto in wallet is more than 60%
 BUY  98% of crypto when RSI reach value lower than 25
 BUY  50% of crypto when RSI is between 25 and 30 and crypto in wallet is less than 51%
*/

import { logger } from '../logger';

const getStrategy = (indicator, wallet) => {
    if (wallet === undefined) {
        logger.warn('Strategy', { reason: 'Missing wallet'});
        return { action: 'WAIT', amount: 0, level: 0 };
    }
    if (wallet.fee.value <= 0) {
        logger.warn('Strategy', { reason: 'I am not trading without BNB for cheaper fees.'});
        return { action: 'WAIT', amount: 0, level: 0 };
    }
    if (indicator <= 0) {
        logger.warn('Strategy', { reason: 'I am not trading - missing indicator value.'});
        return { action: 'WAIT', amount: 0, level: 0 };
    }

    const stablePerc = (wallet.stable.estimateCrypto / (wallet.stable.estimateCrypto + wallet.crypto.value)) * 100;
    const cryptoPerc = (100 - stablePerc);
    if (indicator > 75) {
        const invest = calculateInvestmentValue(wallet, 98, 'SELL');
        return { action: invest > 0 ? 'SELL' : 'WAIT', amount: invest, level: 1 };
    } else if (indicator > 70 && cryptoPerc > 60) {
        const invest = calculateInvestmentValue(wallet, 50, 'SELL');
        return { action: invest > 0 ? 'SELL' : 'WAIT', amount: invest, level: 2 };
    } else if (indicator > 25 && indicator < 30 && cryptoPerc < 51) {
        const invest = calculateInvestmentValue(wallet, 50, 'BUY');
        return { action: invest > 0 ? 'BUY' : 'WAIT', amount: invest, level: 2 };
    } else if (indicator <= 25) {
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

export {
    getStrategy,
};
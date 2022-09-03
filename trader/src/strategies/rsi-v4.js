/*
 Simple RSI strategy 
 SELL 98% of crypto when RSI reach value higher than 70
 BUY 98% of crypto when RSI reach value lower than 30
*/

const { logger } = require('../logger');

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

    if (indicator > 70) {
        const invest = calculateInvestmentValue(wallet, 98, 'SELL');
        return { action: invest > 0 ? 'SELL' : 'WAIT', amount: invest, level: 1 };
    } else if (indicator <= 30) {
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

module.exports = {
    getStrategy: getStrategy,
};
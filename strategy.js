const getStrategy = (indicator, wallet) => {
    if (wallet.fee.value <= 0) {
        console.log('I am not trading without BNB for cheaper fees.');
        return { action: 'WAIT', amount: 0, level: 0 };
    }

    const stablePerc = (wallet.stable.estimateCrypto / (wallet.stable.estimateCrypto + wallet.crypto.value)) * 100;
    const cryptoPerc = (100 - stablePerc);

    console.log('Current RATE:      ' + cryptoPerc.toFixed(2) + ':' + stablePerc.toFixed(2));

    if (indicator > 75) {
        const invest = calculateInvestmentValue(wallet, 100);
        return { action: invest > 0 ? 'SELL' : 'WAIT', amount: invest, level: 1 };
    } else if (indicator > 70 && stablePerc < 85) {
        const invest = calculateInvestmentValue(wallet, 50);
        return { action: invest > 0 ? 'SELL' : 'WAIT', amount: invest, level: 2 };
    } else if (indicator > 65 && indicator < 70 && stablePerc < 50) {
        const invest = calculateInvestmentValue(wallet, 10);
        return { action: invest > 0 ? 'SELL' : 'WAIT', amount: invest, level: 3 };
    } else if (indicator > 60 && indicator < 65 && stablePerc < 20) {
        const invest = calculateInvestmentValue(wallet, 5);
        return { action: invest > 0 ? 'SELL' : 'WAIT', amount: invest, level: 4 };
    } else if (indicator > 35 && indicator < 40 && stablePerc > 85) {
        const invest = calculateInvestmentValue(wallet, 12);
        return { action: invest > 0 ? 'BUY' : 'WAIT', amount: invest, level: 4 };
    } else if (indicator > 30 && indicator < 35 && stablePerc > 70) {
        const invest = calculateInvestmentValue(wallet, 15);
        return { action: invest > 0 ? 'BUY' : 'WAIT', amount: invest, level: 3 };
    } else if (indicator > 25 && indicator < 30 && stablePerc > 30) {
        const invest = calculateInvestmentValue(wallet, 50);
        return { action: invest > 0 ? 'BUY' : 'WAIT', amount: invest, level: 2 };
    } else if (indicator <= 25) {
        const invest = calculateInvestmentValue(wallet, 100);
        return { action: invest > 0 ? 'BUY' : 'WAIT', amount: invest, level: 1 };
    } else {
        return { action: 'WAIT', amount: 0, level: 0 };
    }
}

const calculateInvestmentValue = (wallet, perc) => {
    const invest = (wallet.stable.value / 100) * perc;
    if (invest < 11) {
        //usually there is limit and with such a fraction is not allowed to be traded
        console.log("Low Limit: " + invest);
        return 0;
    }
    return invest;
}

module.exports = {
    getStrategy: getStrategy,
};
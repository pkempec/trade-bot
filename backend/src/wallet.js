const INDICATOR_TYPE = process.env.INDICATOR;
const INTERVAL = process.env.INTERVAL;

let wallet = 'Loading check later.';
let indicator = '';

const setState = (walletValue, indicatorValue) => {
  wallet = walletValue;
  indicator = indicatorValue;
}

const getState = () => {
  return {
    wallet,
    indicator : {
      type: INDICATOR_TYPE + '/' + INTERVAL,
      value: (indicator !== undefined ? indicator.toFixed(2) : indicator)
    }
  }
}

module.exports = {
  setState,
  getState,
};
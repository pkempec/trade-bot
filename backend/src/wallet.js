const INDICATOR_TYPE = process.env.INDICATOR;

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
      value: indicator,
      type: INDICATOR_TYPE
    }
  }
}

module.exports = {
  setState,
  getState,
};
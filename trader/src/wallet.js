let wallet;
let indicator;

const setState = (walletValue, indicatorValue) => {
  wallet = walletValue;
  indicator = indicatorValue;
}

const getState = () => {
  return {
    wallet,
    indicator
  }
}

module.exports = {
  setState,
  getState,
};
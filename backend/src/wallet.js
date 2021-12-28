let wallet = 'Loading check later.';

const setWallet = (value) => {
  wallet = value;
}
const getWallet = () => {
  return wallet;
}

module.exports = {
  setWallet,
  getWallet,
};
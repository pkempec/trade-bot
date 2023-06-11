import { loadConfig, storeConfigState } from "./storage";
import { logger } from './logger';

let config = {
  state: 'paused',
}

const getConfig = () => {
  return config;
}

const initConfig = async () => {
  const dbConfig = await loadConfig();
  if (dbConfig && dbConfig[0] && dbConfig[0].state) {
    config = dbConfig[0];
  }
  logger.info('Config state: ' + config.state);
}

const setConfigState = async (state) => {
  setConfigState(state);
  config.state = state;
}

export {
  initConfig,
  getConfig,
  setConfigState,
};

import tradeLog from '../../data/trades.log';

const loadLogMap = (setLogMap, setSelect) => {
  const importAll = (r) => {
    return r.keys().map(r);
  }
  const imports = importAll(require.context('../../data', false, /trade-.*\.(log)$/));
  const data = new Map(imports.map( value => [value.default.slice(20,30), value]))
  setLogMap(data);
  setSelect(Array.from(data.keys()).pop());
}

const loadHistoryByDay = (date, logMap, setData) => {
  if (logMap && logMap.get(date) && logMap.get(date).default) {
    readLog(logMap.get(date).default, setData);
  }
}

const loadJsonHistoryFilter = async (logMap, filter, setJsonData, setSpinner) => {
  let json =[];
  if (logMap) {
    for(let value of logMap.values()) {
      let logs = await getLogInterval(value.default, filter);
      json = [...json, ...logs]
    }
  }
  setJsonData(json);
  setSpinner(false);
}

const loadTrades = (setData) => {
  readLog(tradeLog, setData);
}

const loadFirstLog = (logMap, setData) => {
  if(logMap.size > 0) {
    const arr = Array.from(logMap.keys());
    const date = arr[0];
    readJsonLog(logMap.get(date).default, setData);
  }
}

const loadLastLog = (logMap, setData) => {
  if(logMap.size > 0) {
    const arr = Array.from(logMap.keys());
    const date = arr[arr.length - 1];
    readJsonLog(logMap.get(date).default, setData);
  }
}

const readJsonLog = (log, setData) => {
  fetch(log)
  .then(r => r.text())
  .then(text => {
    const json = JSON.parse('[' + text.trim().replace(/,$/,'') + ']');
    setData(json);
  });
}

const getLogInterval = async (log, intervalFilter) => {
  const response = await fetch(log);
  const text = await response.text();
  const json = JSON.parse('[' + text.trim().replace(/,$/,'') + ']');
  const filteredJson = json.filter((log) => log?.time && intervalFilter(log));
  return filteredJson;
}

const filter30min = (log) => {
  return (log?.time?.endsWith('00:00') || log?.time?.endsWith('30:00'));
}

const filter1hour = (log) => {
  return log?.time?.endsWith('00:00');
}

const filter4hour = (log) => {
  return (log?.time?.endsWith('00:00:00') || log?.time?.endsWith('04:00:00') ||  log?.time?.endsWith('08:00:00') ||  log?.time?.endsWith('12:00:00') ||  log?.time?.endsWith('16:00:00') ||  log?.time?.endsWith('20:00:00'));
}


const readLog = (log, setData) => {
  fetch(log)
  .then(r => r.text())
  .then(text => {
    const json = JSON.parse('[' + text.trim().replace(/,$/,'') + ']');
    setData(json);
  });
}

export {
  loadLogMap,
  loadTrades,
  loadHistoryByDay,
  loadJsonHistoryFilter,
  loadFirstLog,
  loadLastLog,
  filter30min,
  filter1hour,
  filter4hour,
}
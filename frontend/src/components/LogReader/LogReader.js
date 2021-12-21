
import tradeLog from '../../data/trades.log';

const parseJsonData = (json) => {
    
  const radius = (context) => {
    let radius = 0;
    switch(context.dataset?.action?.[context.dataIndex]) {
      case 'SELL':
        radius = 4;
        break;
        case 'BUY':
        radius = 4;
        break;
      default:
        break;
    }
    return radius;
  }

  const data =  {
    labels : json.map(log => log.time),
    datasets: [
      {
        label: 'USD',
        data: json.map(log => log.wallet?.total?.estimate),
        action: json.map(log => log.strategy?.action),
        symbol: true,
        borderColor: '#FF4286',
        backgroundColor: '#FF4286',
        yAxisID: 'y1',
        pointRadius: radius,
        // tension: 0.4,
      },
      {
        label: 'RSI',
        data: json.map(log => log.indicator?.value),
        action: json.map(log => log.strategy?.action),
        borderColor: '#FF6C52',
        backgroundColor: '#FF6C52',
        yAxisID: 'y1',
      },
      {
        label: 'Price',
        data: json.map(log => log.wallet?.crypto?.askPrice),
        action: json.map(log => log.strategy?.action),
        borderColor: '#AF5CFC',
        backgroundColor: '#AF5CFC',
        yAxisID: 'y1',
      },
      {
        label: 'Stable',
        data: json.map(log => log.wallet?.stable?.value),
        borderColor: '#007D51',
        backgroundColor: '#007D51',
        fill: true,
        yAxisID: 'y',
      },
      {
        label: 'Crypto',
        data: json.map(log => log.wallet?.crypto?.estimateStable),
        borderColor: '#FFE37B',
        backgroundColor: '#FFE37B',
        fill: true,
        yAxisID: 'y',
      },
      {
        label: 'Est Total Stable',
        data: json.map(log => (log.wallet?.stable?.value + log.wallet?.crypto?.estimateStable).toFixed(2)),
        borderColor: '#005D57',
        backgroundColor: '#005D57',
        yAxisID: 'y1',
      },
      {
        label: 'Est. Total Crypto',
        data: json.map(log => (log.wallet?.crypto?.value + log.wallet?.stable?.estimateCrypto).toFixed(2)),
        borderColor: '#37EFBA',
        backgroundColor: '#37EFBA',
        yAxisID: 'y1',
      },
    ],
  };
  return data;
}

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

const loadFilteredHistory = (jsonData, setData) => {
  const data = parseJsonData(jsonData);
  setData(data);
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
    const data = parseJsonData(json);
    setData(data);
  });
}

export {
  loadLogMap,
  loadTrades,
  loadHistoryByDay,
  loadJsonHistoryFilter,
  loadFilteredHistory,
  loadFirstLog,
  loadLastLog,
  filter30min,
  filter1hour,
  filter4hour,
}
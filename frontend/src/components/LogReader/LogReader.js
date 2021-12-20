
import tradeLog from '../../data/trades.log';

const colors = [
  '#FF3784',
  '#36A2EB',
  '#4BC0C0',
  'rgba(247,147,26, 0.5)',
  'rgba(55, 159, 122, 0.5)',
  '#9966FF',
  '#00A8C6',
  '#CC2738',
  '#8B628A',
  '#8FBE00',
  '#606060',
];

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
        borderColor: colors[0],
        backgroundColor: colors[0],
        yAxisID: 'y1',
        pointRadius: radius,
        // tension: 0.4,
      },
      {
        label: 'RSI',
        data: json.map(log => log.indicator?.value),
        action: json.map(log => log.strategy?.action),
        borderColor: colors[1],
        backgroundColor: colors[1],
        yAxisID: 'y1',
      },
      {
        label: 'Price',
        data: json.map(log => log.wallet?.crypto?.askPrice),
        action: json.map(log => log.strategy?.action),
        borderColor: colors[2],
        backgroundColor: colors[2],
        yAxisID: 'y1',
      },
      {
        label: 'Stable',
        data: json.map(log => log.wallet?.stable?.value),
        borderColor: colors[4],
        backgroundColor: colors[4],
        fill: true,
        yAxisID: 'y',
      },
      {
        label: 'Crypto',
        data: json.map(log => log.wallet?.crypto?.estimateStable),
        borderColor: colors[3],
        backgroundColor: colors[3],
        fill: true,
        yAxisID: 'y',
      },
      {
        label: 'Est Total Stable',
        data: json.map(log => (log.wallet?.stable?.value + log.wallet?.crypto?.estimateStable).toFixed(2)),
        borderColor: 'blue',
        yAxisID: 'y1',
      },
      {
        label: 'Est. Total Crypto',
        data: json.map(log => (log.wallet?.crypto?.value + log.wallet?.stable?.estimateCrypto).toFixed(2)),
        borderColor: 'purple',
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
  loadFirstLog,
  loadLastLog
}
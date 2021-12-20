import React, { useEffect, useState } from 'react';
import { MenuItem, Select } from '@material-ui/core';

import ProfitLoss from './components/ProfitLoss/ProfitLoss';
import TradeChart from './components/TradeChart/TradeChart';
import { loadFirstLog, loadHistoryByDay, loadLastLog, loadLogMap, loadTrades } from './components/LogReader/LogReader';


const App = () => {

  const empty = {
    labels: [''],
    datasets: [
      {
        label: 'Empty',
        data: [0],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  const emptyProfitLoss = [{ 
    name: 'wallet',
    startStable: 0,
    currentStable: 0,
    plStable: 0,
    startCrypto: 0,
    currentCrypto: 0,
    plCrypto: 0
  }]

  const [trades, setTrades] = useState(empty);
  const [log, setLog] = useState(empty);
  const [logMap, setLogMap] = useState(new Map())
  const [select, setSelect] = useState('');
  const [firstLog, setFirstLog] = useState();
  const [lastLog, setLastLog] = useState();
  const [profitLoss, setProfitLoss] = useState(emptyProfitLoss);

  useEffect(() => {
    loadTrades(setTrades);
    loadLogMap(setLogMap, setSelect);
  }, []);

  useEffect(() => {
    loadFirstLog(logMap, setFirstLog);
    loadLastLog(logMap, setLastLog);
  }, [logMap]);

  useEffect(() => {
    loadHistoryByDay(select, logMap, setLog);
  }, [select, logMap]);

  const handleSelection = (event) => {
    setSelect(event.target.value);
  };

  return ( 
    <div>
      <ProfitLoss first={firstLog} last={lastLog} profitLoss={profitLoss} setProfitLoss={setProfitLoss} />
      <Select
          labelId="date-label"
          id="date-id"
          value={select}
          onChange={handleSelection}
      >
        {
          [...logMap.keys()].map(key =>
            <MenuItem value={key} key={key}>{key}</MenuItem>
          )
        }
      </Select>
      <TradeChart data={log} />
      <TradeChart data={trades} />
    </div>
    );
}

export default App;

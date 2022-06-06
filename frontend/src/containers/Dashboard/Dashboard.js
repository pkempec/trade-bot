import React, { useEffect, useState } from 'react';
import { MenuItem, Select } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import LinearProgress from '@material-ui/core/LinearProgress';

import ProfitLoss from '../../components/ProfitLoss/ProfitLoss';
import TradeChart from '../../components/TradeChart/TradeChart';
import TradeStats from '../../components/TradeStats/TradeStats';
import { loadFirstLog, loadHistoryByDay, loadJsonHistoryFilter, loadLastLog, loadLogMap, loadTrades, filter4hour, filter24hour} from '../../components/LogReader/LogReader';

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          {children}
        </Box>
      )}
    </div>
  );
}

const Dashboard = () => {
  const empty = [];

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
  const [spinner, setSpinner] = useState(true);

  const [filter, setFilter] = useState(() => () => filter24hour);

  const [jsonData, setJsonData] = useState([]);

  useEffect(() => {
    loadTrades(setTrades);
    loadLogMap(setLogMap, setSelect);
  }, []);

  useEffect(() => {
    loadFirstLog(logMap, setFirstLog);
    loadLastLog(logMap, setLastLog);
  }, [logMap]);

  useEffect(() => {
    setSpinner(true);
    loadJsonHistoryFilter(logMap, filter, setJsonData, setSpinner);
  }, [logMap, filter])

  useEffect(() => {
    loadHistoryByDay(select, logMap, setLog);
  }, [select, logMap]);

  const handleDateSelection = (event) => {
    setSelect(event.target.value);
  };

  const [selectedTab, setSelectedTab] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    switch(newValue){
      case 1:
        setJsonData(empty)
        setFilter(() => filter24hour);
        break;
      case 2:
        setJsonData(empty)
        setFilter(() => filter4hour);
        break;
      default:
        setJsonData(empty)
        break;
    }
    setSelectedTab(newValue);
  };

  return ( 
    <div>
      <LinearProgress hidden={!spinner} />
      <ProfitLoss first={firstLog} last={lastLog} lastTrade={trades[trades.length-1]} profitLoss={profitLoss} setProfitLoss={setProfitLoss} />
      <AppBar position="static">
      <Tabs value={selectedTab} onChange={handleTabChange} aria-label="simple tabs example">
          <Tab label="Daily" id='0' />
          <Tab label="24 hour" id='1' />
          <Tab label="4 hour" id='2' />
          <Tab label="Trades" id='3' />
        </Tabs>
      </AppBar>
      <TabPanel value={selectedTab} index={0}>
        <Select
            labelId="date-label"
            id="date-id"
            value={select}
            onChange={handleDateSelection}
        >
          {
            [...logMap.keys()].map(key =>
              <MenuItem value={key} key={key}>{key}</MenuItem>
            )
          }
        </Select>
        <TradeChart data={log} />
      </TabPanel>
      <TabPanel value={selectedTab} index={1}>
        <TradeChart data={jsonData} />
      </TabPanel>
      <TabPanel value={selectedTab} index={2}>
        <TradeChart data={jsonData} />
      </TabPanel>
      <TabPanel value={selectedTab} index={3}>
        <TradeChart data={trades} />
        <TradeStats trades={trades}/>
      </TabPanel>
    </div>
    );
}

export default Dashboard;

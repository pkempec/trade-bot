import React, { useEffect, useState } from 'react';
import { MenuItem, Select } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import LinearProgress from '@material-ui/core/LinearProgress';
import moment from 'moment';

import ProfitLoss from '../../components/ProfitLoss/ProfitLoss';
import TradeChart from '../../components/TradeChart/TradeChart';
import TradeStats from '../../components/TradeStats/TradeStats';
import { loadFirstRecord, loadLastRecord, loadTrades, loadDays, loadDate, loadDaily } from '../../components/DataReader/DataReader';

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
  const [current, setCurrent] = useState(empty);
  const [selectDates, setSelectDates] = useState([moment().format('YYYY-MM-DD')]);
  const [select, setSelect] = useState(moment().format('YYYY-MM-DD'));
  const [firstLog, setFirstLog] = useState();
  const [lastLog, setLastLog] = useState();
  const [profitLoss, setProfitLoss] = useState(emptyProfitLoss);
  const [spinner, setSpinner] = useState(true);


  useEffect(() => {
    loadFirstRecord(setFirstLog);
    loadLastRecord(setLastLog);
    loadTrades(setTrades);
    loadDays(setSelectDates, setSelect);
  }, []);

  useEffect(() => {
    setSpinner(true);
    loadDate(select, setCurrent, setSpinner);
  }, [select]);

  const handleDateSelection = (event) => {
    setSelect(event.target.value);
  };

  const [selectedTab, setSelectedTab] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    switch (newValue) {
      case 0:
        loadDate(select, setCurrent, setSpinner);
        break;
      case 1:
        setSpinner(true);
        loadDaily(setCurrent, setSpinner)
        break;
      default:
        break;
    }
    setSelectedTab(newValue);
  };

  return (
    <div>
      <LinearProgress hidden={!spinner} />
      <ProfitLoss first={firstLog} last={lastLog} lastTrade={trades[trades.length - 1]} profitLoss={profitLoss} setProfitLoss={setProfitLoss} />
      <AppBar position="static">
        <Tabs value={selectedTab} onChange={handleTabChange} aria-label="simple tabs example">
          <Tab label="Daily" id='0' />
          <Tab label="24 hour" id='1' />
          <Tab label="Trades" id='2' />
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
            selectDates.map(date =>
              <MenuItem value={date} key={date}>{date}</MenuItem>
            )
          }
        </Select>
        <TradeChart data={current} />
      </TabPanel>
      <TabPanel value={selectedTab} index={1}>
        <TradeChart data={current} />
      </TabPanel>
      <TabPanel value={selectedTab} index={2}>
        <TradeChart data={trades} />
        <TradeStats trades={trades} />
      </TabPanel>
    </div>
  );
}

export default Dashboard;

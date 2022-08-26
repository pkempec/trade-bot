import axios from 'axios';

const HOST = process.env.REACT_APP_BACKEND_HOST;

const loadFirstRecord = (setFirstTrade) => {
  axios({
    method: 'get',
    url: HOST + 'stats/first'
  })
    .then(function (response) {
      setFirstTrade(response.data);
    });
}

const loadLastRecord = (setLastTrade) => {
  axios({
    method: 'get',
    url: HOST + 'stats/last'
  })
    .then(function (response) {
      setLastTrade(response.data);
    });
}

const loadTrades = (setTrades) => {
  axios({
    method: 'get',
    url: HOST + 'stats/trades'
  })
    .then(function (response) {
      setTrades(response.data);
    });
}

const loadDate = (date, setCurrent, setSpinner) => {
  axios({
    method: 'get',
    url: HOST + 'stats/24h?date=' + date
  })
    .then(function (response) {
      setCurrent(response.data);
      setSpinner(false);
    });
}

const loadDaily = (setCurrent, setSpinner) => {
  axios({
    method: 'get',
    url: HOST + 'stats/daily'
  })
    .then(function (response) {
      setCurrent(response.data);
      setSpinner(false);
    });
}

const loadDays = (setSelectedDates, setSelected) => {
  axios({
    method: 'get',
    url: HOST + 'stats/dates'
  })
    .then(function (response) {
      const dates = response.data
      setSelected(dates[0]);
      setSelectedDates(dates);
    });
}

export {
  loadFirstRecord,
  loadLastRecord,
  loadTrades,
  loadDays,
  loadDate,
  loadDaily,
}
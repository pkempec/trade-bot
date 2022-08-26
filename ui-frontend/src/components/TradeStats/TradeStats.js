import React from "react";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { StyledTableCell } from '../Theme/Theme';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

const TradeStats = (props) => {
  const getFirstBuy = (trades) => {
    for (let trade of trades) {
      if (trade.strategy.action === 'BUY') {
        return trade;
      }
    }
    return null;
  }

  const calcTradeDelta = (trades) => {
    let results = [];
    let buy = getFirstBuy(trades)?.wallet?.total?.estimate;
    let buyTime = getFirstBuy(trades)?.time;
    let skip = true;

    for (let trade of trades) {
      if (skip) {
        if (trade.strategy.action !== 'BUY') {
          continue;
        }
        skip = false;
        continue;
      }
      if (trade.strategy.action === 'SELL') {
        let sell = trade.wallet.total.estimate;
        let sellTime = trade.time;
        let sellTimeM = sellTime ? moment(sellTime, 'YYYY.MM.DD HH:mm:ss') : null;
        let buyTimeM = buyTime ? moment(buyTime, 'YYYY.MM.DD HH:mm:ss') : null;
        results.push({
          id: uuidv4(),
          buy: buy.toFixed(2),
          buyTime: buyTime,
          sell: sell.toFixed(2),
          sellTime: sellTime,
          diffTime: (sellTimeM && buyTimeM) ? sellTimeM.diff(buyTimeM, "days") + ' d' : '',
          diff: (sell - buy).toFixed(2),
          perc: (((sell / buy) - 1) * 100).toFixed(2)
        })
      } else {
        buy = trade.wallet.total.estimate;
        buyTime = trade.time;
      }
    }

    return results;
  };

  const tradeDelta = calcTradeDelta(props.trades);

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <StyledTableCell>BUY</StyledTableCell>
            <StyledTableCell>SELL</StyledTableCell>
            <StyledTableCell>BUY Time</StyledTableCell>
            <StyledTableCell>SELL Time</StyledTableCell>
            <StyledTableCell align="right">∆ ⧖</StyledTableCell>
            <StyledTableCell align="right">∆ $</StyledTableCell>
            <StyledTableCell align="right">%</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tradeDelta.map(trade => (
            <TableRow key={trade.id}>
              <StyledTableCell>{trade.buy}</StyledTableCell>
              <StyledTableCell>{trade.sell}</StyledTableCell>
              <StyledTableCell>{trade.buyTime}</StyledTableCell>
              <StyledTableCell>{trade.sellTime}</StyledTableCell>
              <StyledTableCell align="right">{trade.diffTime}</StyledTableCell>
              <StyledTableCell align="right">{trade.diff + ' $'}</StyledTableCell>
              <StyledTableCell align="right">{trade.perc + ' %'}</StyledTableCell>
            </TableRow>
          )
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default TradeStats;
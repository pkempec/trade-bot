import React, { useEffect } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { StyledTableCell } from '../Theme/Theme';
import moment from 'moment';

const ProfitLoss = (props) => {

  const start = props.first;
  const current = props.last;
  const setProfitLoss = props.setProfitLoss;
  const lastTrade = props.lastTrade;

  useEffect(() => {

    const getCrypto = (log) => {
      return (log.wallet?.crypto?.value + log.wallet?.stable?.estimateCrypto)?.toFixed(2);
    }

    const getStable = (log) => {
      return (log.wallet?.stable?.value + log.wallet?.crypto?.estimateStable)?.toFixed(2);
    }

    const calcProfitLoss = (start, current) => {
      return (((current / start) - 1) * 100).toFixed(2) + ' %';
    }

    const calcSinceLastTrade = (lastTrade, current) => {
      if (current?.wallet?.crypto?.askPrice
        && lastTrade?.wallet?.crypto?.askPrice
        && lastTrade?.strategy?.action) {
        if (lastTrade.strategy.action === 'BUY') {
          return (current.wallet.crypto.askPrice - lastTrade.wallet.crypto.askPrice).toFixed(2);
        }
        return (lastTrade.wallet.crypto.askPrice - current.wallet.crypto.askPrice).toFixed(2);
      }
      return '';
    }

    const calcHodl = (current, startCrypto) => {
      if (current?.wallet?.crypto?.bidPrice && startCrypto) {
        return (current?.wallet?.crypto?.bidPrice * startCrypto)?.toFixed(2);
      }
      return '';
    }

    if (start && current) {
      const startStable = getStable(start);
      const startCrypto = getCrypto(start);
      const cryptoSymbol = current.wallet?.crypto?.symbol;

      const currentEstimatedStable = getStable(current);
      const currentEstimatedCrypto = getCrypto(current);
      const estimateHodl = calcHodl(current, startCrypto);

      const currentStable = (current.wallet?.stable?.value)?.toFixed(2);
      const currentCrypto = (current.wallet?.crypto?.value)?.toFixed(2);

      const plStable = calcProfitLoss(startStable, currentEstimatedStable);
      const plCrypto = calcProfitLoss(startCrypto, currentEstimatedCrypto);
      const plHodl = calcProfitLoss(estimateHodl, currentEstimatedStable);

      const sinceLastTrade = calcSinceLastTrade(lastTrade, current);


      setProfitLoss({
        startStable,
        currentEstimatedStable,
        plStable,
        startCrypto,
        currentEstimatedCrypto,
        plCrypto,
        currentStable,
        currentCrypto,
        sinceLastTrade,
        estimateHodl,
        cryptoSymbol,
        plHodl
      });
    }

  }, [start, current, setProfitLoss, lastTrade])


  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <StyledTableCell>Start {(start?.time ? moment(start.time).format('DD.MM.YYYY') : '') + ' (' + props.profitLoss.startStable + ' $)'}</StyledTableCell>
            <StyledTableCell align="right">Hodl</StyledTableCell>
            <StyledTableCell align="right">Current Est.</StyledTableCell>
            <StyledTableCell align="right">Wallet</StyledTableCell>
            <StyledTableCell align="right">P/L ({props.profitLoss.plStable})</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow key={props.profitLoss.since}>
            <StyledTableCell component="th" scope="row">Stable</StyledTableCell>
            <StyledTableCell align="right">{props.profitLoss.estimateHodl + ' $'}</StyledTableCell>
            <StyledTableCell align="right">{props.profitLoss.currentEstimatedStable + ' $'}</StyledTableCell>
            <StyledTableCell align="right">{props.profitLoss.currentStable + ' $'}</StyledTableCell>
            <StyledTableCell align="right">{props.profitLoss.plHodl}</StyledTableCell>
          </TableRow>
          <TableRow key={props.profitLoss.name}>
            <StyledTableCell component="th" scope="row">Crypto</StyledTableCell>
            <StyledTableCell align="right">{props.profitLoss.startCrypto + ' ' + props.profitLoss.cryptoSymbol}</StyledTableCell>
            <StyledTableCell align="right">{props.profitLoss.currentEstimatedCrypto + ' ' + props.profitLoss.cryptoSymbol}</StyledTableCell>
            <StyledTableCell align="right">{props.profitLoss.currentCrypto + ' ' + props.profitLoss.cryptoSymbol}</StyledTableCell>
            <StyledTableCell align="right">{props.profitLoss.plCrypto}</StyledTableCell>
          </TableRow>
          <TableRow key={props.profitLoss.name}>
            <StyledTableCell component="th" scope="row">Last Trade</StyledTableCell>
            <StyledTableCell align="right"></StyledTableCell>
            <StyledTableCell align="right">{lastTrade?.strategy?.action + ' for ' + lastTrade?.wallet?.crypto?.askPrice}</StyledTableCell>
            <StyledTableCell align="right">Current price {current?.wallet?.crypto?.askPrice}</StyledTableCell>
            <StyledTableCell align="right">∆ {props.profitLoss.sinceLastTrade}</StyledTableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>

  );
}

export default ProfitLoss;
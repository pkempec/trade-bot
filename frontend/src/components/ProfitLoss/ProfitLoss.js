import React, { useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { themeDark} from '../Theme/Theme';

const StyledTableCell = withStyles((theme) => ({
  head: {
    borderColor: themeDark.palette.secondary.main,
    textTransform: 'uppercase',
  },
  body: {
    borderColor: themeDark.palette.secondary.main,
  }
}))(TableCell);

const ProfitLoss = (props) => {

  const start =  props.first ? props.first[0] : null;
  const current = props.last ? props.last[props.last.length-1] : null;
  const setProfitLoss = props.setProfitLoss;
  const lastTrade = props.lastTrade;

  useEffect(() => {

    const getCrypto = (log) => {
      return (log.wallet?.crypto?.value + log.wallet?.stable?.estimateCrypto).toFixed(2);
    }

    const getStable = (log) => {
      return (log.wallet?.stable?.value + log.wallet?.crypto?.estimateStable).toFixed(2);
    }

    const calcProfitLoss = (start, current) => {
      return (((current/start) - 1) * 100).toFixed(2) + ' %';
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

    const calcHodl = (lastTrade, startCrypto) => {
      if (lastTrade?.wallet?.crypto?.bidPrice && startCrypto) {
        return (lastTrade?.wallet?.crypto?.bidPrice * startCrypto).toFixed(2);
      }
      return '';
    }

    if(start && current) {            
      const startStable = getStable(start);
      const startCrypto = getCrypto(start);
      const cryptoSymbol = current.wallet?.crypto?.symbol;
  
      const currentEstimatedStable = getStable(current);
      const currentEstimatedCrypto = getCrypto(current);
      
      const currentStable = (current.wallet?.stable?.value).toFixed(2);
      const currentCrypto = (current.wallet?.crypto?.value).toFixed(2);
      
      const plStable = calcProfitLoss(startStable, currentEstimatedStable);
      const plCrypto = calcProfitLoss(startCrypto, currentEstimatedCrypto);

      const sinceLastTrade = calcSinceLastTrade(lastTrade, current);

      const estimateHodl = calcHodl(lastTrade, startCrypto);
    
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
        cryptoSymbol
      });
    }
  
  }, [start, current, setProfitLoss, lastTrade])
  

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <StyledTableCell>{'Start ' + start?.time?.split(' ')[0] + ' - ' + props.profitLoss.startStable + ' $'}</StyledTableCell>
            <StyledTableCell align="right">Hodl</StyledTableCell>
            <StyledTableCell align="right">Current Est.</StyledTableCell>
            <StyledTableCell align="right">Wallet</StyledTableCell>
            <StyledTableCell align="right">P/L</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow key={props.profitLoss.since}>
            <StyledTableCell component="th" scope="row">Stable</StyledTableCell>
            <StyledTableCell align="right">{props.profitLoss.estimateHodl + ' $'}</StyledTableCell>
            <StyledTableCell align="right">{props.profitLoss.currentEstimatedStable + ' $'}</StyledTableCell>
            <StyledTableCell align="right">{props.profitLoss.currentStable + ' $'}</StyledTableCell>
            <StyledTableCell align="right">{props.profitLoss.plStable}</StyledTableCell>
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
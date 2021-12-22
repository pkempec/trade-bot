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

    if(start && current) {            
      const startStable = getStable(start);
      const startCrypto = getCrypto(start);
  
      const currentEstimatedStable = getStable(current);
      const currentEstimatedCrypto = getCrypto(current);
      
      const currentStable = (current.wallet?.stable?.value).toFixed(2);
      const currentCrypto = (current.wallet?.crypto?.value).toFixed(2);
      
      const plStable = calcProfitLoss(startStable, currentEstimatedStable);
      const plCrypto = calcProfitLoss(startCrypto, currentEstimatedCrypto);
    
      setProfitLoss({
        since: 'Since ' + start?.time?.split(' ')[0],
        name: 'Wallet',
        startStable,
        currentEstimatedStable,
        plStable,
        startCrypto,
        currentEstimatedCrypto,
        plCrypto,
        currentStable,
        currentCrypto
      });
    }
  
  }, [start, current, setProfitLoss])
  

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <StyledTableCell>Profit/Loss</StyledTableCell>
            <StyledTableCell align="right">Start Stable</StyledTableCell>
            <StyledTableCell align="right">Current Stable</StyledTableCell>
            <StyledTableCell align="right">P/L</StyledTableCell>
            <StyledTableCell align="right">Start Crypto</StyledTableCell>
            <StyledTableCell align="right">Current Crypto</StyledTableCell>
            <StyledTableCell align="right">P/L</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            <TableRow key={props.profitLoss.since}>
              <StyledTableCell component="th" scope="row">
                {props.profitLoss.since}
              </StyledTableCell>
              <StyledTableCell align="right">{props.profitLoss.startStable}</StyledTableCell>
              <StyledTableCell align="right">{props.profitLoss.currentEstimatedStable}</StyledTableCell>
              <StyledTableCell align="right">{props.profitLoss.plStable}</StyledTableCell>
              <StyledTableCell align="right">{props.profitLoss.startCrypto}</StyledTableCell>
              <StyledTableCell align="right">{props.profitLoss.currentEstimatedCrypto}</StyledTableCell>
              <StyledTableCell align="right">{props.profitLoss.plCrypto}</StyledTableCell>
            </TableRow>
          }
          {
            <TableRow key={props.profitLoss.name}>
              <StyledTableCell component="th" scope="row">
                {props.profitLoss.name}
              </StyledTableCell>
              <StyledTableCell align="right"></StyledTableCell>
              <StyledTableCell align="right">{props.profitLoss.currentStable}</StyledTableCell>
              <StyledTableCell align="right"></StyledTableCell>
              <StyledTableCell align="right"></StyledTableCell>
              <StyledTableCell align="right">{props.profitLoss.currentCrypto}</StyledTableCell>
              <StyledTableCell align="right"></StyledTableCell>
            </TableRow>
          }
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ProfitLoss;
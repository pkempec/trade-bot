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
  
      const currentStable = getStable(current);
      const currentCrypto = getCrypto(current);
      
      const plStable = calcProfitLoss(startStable, currentStable);
      const plCrypto = calcProfitLoss(startCrypto, currentCrypto);
    
      setProfitLoss([{
        name: 'Since ' + start?.time?.split(' ')[0],
        startStable,
        currentStable,
        plStable,
        startCrypto,
        currentCrypto,
        plCrypto
      }]);
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
          {props.profitLoss.map((row) => (
            <TableRow key={row.name}>
              <StyledTableCell component="th" scope="row">
                {row.name}
              </StyledTableCell>
              <StyledTableCell align="right">{row.startStable}</StyledTableCell>
              <StyledTableCell align="right">{row.currentStable}</StyledTableCell>
              <StyledTableCell align="right">{row.plStable}</StyledTableCell>
              <StyledTableCell align="right">{row.startCrypto}</StyledTableCell>
              <StyledTableCell align="right">{row.currentCrypto}</StyledTableCell>
              <StyledTableCell align="right">{row.plCrypto}</StyledTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ProfitLoss;
import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const ProfitLoss = (props) => {
  const classes = useStyles();

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
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Profit/Loss</TableCell>
            <TableCell align="right">Start Stable</TableCell>
            <TableCell align="right">Current Stable</TableCell>
            <TableCell align="right">P/L</TableCell>
            <TableCell align="right">Start Crypto</TableCell>
            <TableCell align="right">Current Crypto</TableCell>
            <TableCell align="right">P/L</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.profitLoss.map((row) => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.startStable}</TableCell>
              <TableCell align="right">{row.currentStable}</TableCell>
              <TableCell align="right">{row.plStable}</TableCell>
              <TableCell align="right">{row.startCrypto}</TableCell>
              <TableCell align="right">{row.currentCrypto}</TableCell>
              <TableCell align="right">{row.plCrypto}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ProfitLoss;
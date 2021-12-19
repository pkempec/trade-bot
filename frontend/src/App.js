import React from 'react';
import History from './containers/History/History'
import ProfitLoss from './containers/ProfitLoss/ProfitLoss';
import Trades from './containers/Trades/Trades'

const App = () => {
  return ( 
    <div>
      <ProfitLoss />
      <History />
      <Trades />
    </div>
    );
}

export default App;

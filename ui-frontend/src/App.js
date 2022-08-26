import React from 'react';
import Dashboard from './containers/Dashboard/Dashboard';
import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { themeDark } from './components/Theme/Theme';

import './App.css';

const App = () => {
  return ( 
      <MuiThemeProvider theme={themeDark}>
        <CssBaseline />
        <div className='app'>
          <Dashboard />
        </div>
        <div className='rotate' />
      </MuiThemeProvider>
    );
}

export default App;

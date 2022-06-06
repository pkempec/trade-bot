import { createTheme } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';

const themeLight = createTheme({
  palette: {
    background: {
      default: "#e4f0e2"
    }
  }
});

const themeDark = createTheme({
  palette: {
    primary: {
      main: "#373740",
    },
    secondary: {
      main: "#007D51",
    },
    background: {
      default: "#33333D",
      paper: "#33333D",
    },
    text: {
      primary: "#ffffff",
    },
    action: {
      hover: "#1EB980",
      active: "#007D51",
      selected: "#007D51",
    },
  }
});


const StyledTableCell = withStyles((theme) => ({
  head: {
    borderColor: themeDark.palette.secondary.main,
    textTransform: 'uppercase',
  },
  body: {
    borderColor: themeDark.palette.secondary.main,
  }
}))(TableCell);

export {
  themeDark,
  themeLight,
  StyledTableCell
}
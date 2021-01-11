import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';

const useStyles = makeStyles(() => ({
  appBar: {
    top: 'auto',
    bottom: 0,
  },
}));

function Footer() {
  const classes = useStyles();

  return (
    <footer>
      <AppBar position="static" color="primary" className={classes.appBar}>
        <Toolbar>
          <Typography>© 2020 Graasp Association</Typography>
        </Toolbar>
      </AppBar>
    </footer>
  );
}

export default Footer;

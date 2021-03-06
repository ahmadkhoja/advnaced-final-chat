import  React from 'react'
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
// import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
// import FaUser from 'react-icons/lib/fa/user'

const styles = {
    appBar: {
        position: 'relative',
    },
    flex: {
        flex: 1,
    },
};


function Transition(props) {
    return <Slide direction="up" {...props} />;
  }
  
  class UsersTeamDialog extends React.Component {
    state = {
      open: false,
    };
  
    handleClickOpen = () => {
      this.setState({ open: true });
    };
  
    handleClose = () => {
      this.setState({ open: false });
    };
  
    render() {
      const { classes } = this.props;
      return (
        <div style={{display:'inline-block',marginTop: '5px'}} >
          <Button onClick={this.handleClickOpen}>{/*<FaUser style={{fill:'deepskyblue'}}/>*/}teams</Button>
          <Dialog
            fullScreen
            open={this.state.open}
            onClose={this.handleClose}
            TransitionComponent={Transition}
          >
            <AppBar className={classes.appBar}>
              <Toolbar className="header-dialog">
                {/* <IconButton color="inherit" onClick={this.handleClose} aria-label="Close">
                  <CloseIcon />
                </IconButton> */}
                <Typography variant="title" color="inherit" className={classes.flex}>
                  Your Teams
                </Typography>
                <Button color="inherit" onClick={this.handleClose}>
                <CloseIcon />
                </Button>
              </Toolbar>
            </AppBar>
            {this.props.users_teams}
          </Dialog>
        </div>
      );
    }
  }
  
  export default withStyles(styles)(UsersTeamDialog);
  
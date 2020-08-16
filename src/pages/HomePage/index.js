import React, { Component } from 'react';
import logo from './ismyfoodreadylogo.svg'
import { ReactSVG } from 'react-svg'
import {
  withStyles,
  Typography,
  CssBaseline,
  Button,
  Fab,
  TextField,
} from '@material-ui/core';
import BackendHelpers from '../../utils/BackendHelpers';
import { withRouter, useHistory, Link } from 'react-router-dom';

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderID: "",
      orderFakeDB: {
        "1014": {
          customerName: "Alan Brilliant",
          cashierName: "Joe Biden",
          orderStatus: "Being Prepared",
          item: "Hundreds of nuggets",
        }
      },
      isValid: false,
      custName: "",
      cashName: "",
      status: "",
      orderItems: "",
    };
  }

  alertOnClick = () => {
    console.log(logo)
    if (this.state.orderID !== "") {
      BackendHelpers.getOrder(this.state.orderID)
      if (this.state.orderID in this.state.orderFakeDB) {
        console.log(this.state.orderFakeDB['1014']);
        this.setState({ custName: this.state.orderFakeDB['1014'].customerName, cashName: this.state.orderFakeDB['1014'].cashierName, status: this.state.orderFakeDB['1014'].orderStatus, orderItems: this.state.orderFakeDB['1014'].item })
        this.setState({isValid:true})
      } else {
        alert("Wee woo, wrong order number!")
      }
    } else {
      alert("Joe Biden will take all of your melanin")
    }
  };

  goBack = () => {
    this.setState({isValid: !this.state.isValid})
  }

  setOrder = (e) => {
    this.setState({ orderID: e })
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.page}>
        <CssBaseline />

        <div className={classes.centerContainer}>
          <img className={classes.logo} src={logo} alt="logo"></img>
          <div className={classes.title}>
            <ReactSVG src={classes.logo} />
          </div>
          { this.state.isValid ? 
            <div>
              <Typography>Order ID: {this.state.orderID}</Typography>
              <Typography>Customer Name: {this.state.custName}</Typography>
              <Typography>Cashier Name: {this.state.cashName}</Typography>
              <Typography>Item Ordered: {this.state.orderItems}</Typography>
              <Typography>Order Status: {this.state.status}</Typography> 
              <Button
              variant="contained"
              onClick={() => this.goBack()}
              >
                Back
              </Button>
            </div>
            :
            <div>
              <TextField id="outlined-basic"
                label="Order No."
                variant="outlined"
                onChange={(e) => this.setOrder(e.target.value)}
              />
              <Fab
                className={classes.bigButton}
                onClick={() => this.alertOnClick()}
              >
                Big Button
              </Fab>
            </div>

          }

        </div>
      </div>
    );
  }
}

const styles = () => {
  return {
    bigButton: {
      backgroundColor: 'blue',
      color: 'red',
      width: 400
    },
    page: {
      textAlign: 'center',
    },
    title: {
      marginBottom: '2em',
    },
    centerContainer: {
      marginLeft: 'auto',
      marginRight: 'auto',
      marginTop: '7em',
    },
    hoverExample: {
      marginLeft: 'auto',
      marginRight: 'auto',
      '&:hover': {
        backgroundColor: '#D3D3D3 !important',
      },
    },
    logo: {
      width: "500px",
      height: "500px"
    }
  };
};

export default withStyles(styles)(withRouter(HomePage));

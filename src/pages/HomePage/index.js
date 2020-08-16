import React, { Component } from 'react';
import logo from '../../images/logo.png'
import OrderPage  from '../OrderPages'
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
      isValid: false,
      custName: "",
      cashName: "",
      status: "",
      orderItems: "",
      fontColor:"",
    };
  }

  alertOnClick = () => {
    console.log(logo)
    if (this.state.orderID !== "") {
      BackendHelpers.getOrder(this.state.orderID).then(res => {
        console.log(res)
        this.setState({ custName: res.custName, cashName: res.cashName, status: res.status, orderItems: res.orderItems })
        if(res.status === "Ready"){
          this.setState({fontColor:"green"})
        }else{
          this.setState({fontColor:"red"})
        }
        console.log(this.state.fontColor)
        this.setState({isValid: true})
      }).catch(err => {
        alert(err)
      })
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
          { this.state.isValid ? 
            <div style={{paddingTop:'100px'}}>
              <OrderPage custname={this.state.custName} cashname={this.state.cashName} orderid={this.state.orderID} status={this.state.status} orderitems={this.state.orderItems} fontcolor={this.state.fontColor}></OrderPage>
              <Button
              variant="contained"
              onClick={() => this.goBack()}
              >
                Back
              </Button>
            </div>
            :
            <div style={{paddingTop:'80px'}}>
              <TextField id="outlined-basic"
                label="Order No."
                variant="outlined"
                onChange={(e) => this.setOrder(e.target.value)}
              />
              <div style={{paddingTop:'30px'}}>
                <Button
                  onClick={() => this.alertOnClick()}
                  variant="contained"
                >
                  Big Button
                </Button>
              </div>
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
      width: "200px",
      height: "200px"
    }
  };
};

export default withStyles(styles)(withRouter(HomePage));

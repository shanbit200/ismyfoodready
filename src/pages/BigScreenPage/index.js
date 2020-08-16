import React from 'react';

import {
  withStyles,
  Typography,
  Grid,
  TextField,
  CssBaseline,
  Button,
} from '@material-ui/core';
import BackendHelpers from '../../utils/BackendHelpers';
import { withSnackbar } from 'notistack';
import Select from 'react-select';
import firebase from 'firebase';
import './App.css';


const styles = () => {
  return {
    page: {
      marginLeft: 'auto',
      marginRight: 'auto',
      maxWidth: 1000,
      width: '95%',
    },


   
  };
};

class BigScreenPage extends React.Component {
  constructor(props) {
    super(props);
    this.database = firebase.database().ref("store/Burger King/orders");

    this.state = {
      orders:[]
    };
  }

  componentDidMount() {
    this.setState({ loading: true });
    
 
    this.database.on('value', snapshot => {
        const orderObject = snapshot.val();
        console.log(orderObject)
        if (orderObject) {
            const orderList = Object.keys(orderObject).map(key => {
               return({
                   cashier:orderObject[key]['cashName'],
                   customer:orderObject[key]['custName'],
                   orderId:orderObject[key]['orderID'],
                   item:orderObject[key]['orderItems'],
                   status:orderObject[key]['status']

                })
            });
            
            this.setState({ orders: orderList });
        }
        // convert messages list from snapshot
    
      
    });
  }

  componentWillUnmount() {
    this.database.off();
  }

  

  render() {

    // Check for uri change
    const { classes } = this.props;

    

    return (
        
    <div className={classes.page}>

            
        
        <div className='flexy-col'>
          {this.state.orders.map(order=>
          {return (
              <div className = "flexy-row">
                 <Typography variant="h6" >
                    <b>{order['customer']}</b>
                </Typography>
                <Typography variant="h6" >
                    {order['item']}
                </Typography>
                <Typography variant="h6" >
                    {order['status']}
                </Typography>

              </div>
           
          )})}
          </div>
      </div>
    );
  }
}

export default withStyles(styles)(withSnackbar(BigScreenPage));

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
import TermRequestModal from '../../components/TermRequestModal';

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
    this.database = firebase.database().ref("store/Alan's Chicken Nuggets/Orders");

    this.state = {
      orders:[]
    };
  }

  componentDidMount() {
    this.setState({ loading: true });
 
    this.database.on('value', snapshot => {
        const orderObject = snapshot.val();
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

  

  render() {
    const { classes, user } = this.props;

    // Check for uri change
    
    

    return (
      <div>
          {this.state.orders.map(order=>
            {return <div className ='flex'>{order['cashier']+order['customer']+order['status']}</div>})}
      </div>
    );
  }
}

export default withStyles(styles)(withSnackbar(BigScreenPage));

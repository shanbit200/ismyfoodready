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
    this.database = firebase.database().ref('store/Burger King/orders');

    this.state = {
      orders: [],
      announcedOrderIds: [],
      ordersToAnnounce: [],
    };
  }

  componentDidMount() {
    this.setState({ loading: true });

    this.database.on('value', (snapshot) => {
      const orderObject = snapshot.val();
      if (orderObject) {
        const orderList = Object.keys(orderObject).map((key) => {
          const currOrder = {
            cashier: orderObject[key]['cashName'],
            customer: orderObject[key]['custName'],
            orderId: orderObject[key]['orderID'],
            item: orderObject[key]['orderItems'],
            status: orderObject[key]['status'],
          };

          if (
            !this.state.announcedOrderIds.includes(orderObject[key]['orderID'])
          ) {
            if (
              currOrder.orderId &&
              currOrder.status &&
              currOrder.status.toLowerCase() === 'ready'
            ) {
              this.state.ordersToAnnounce.push(currOrder);
            }
          }

          return currOrder;
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

    if (this.state.ordersToAnnounce.length > 0) {
      this.state.ordersToAnnounce.forEach((order, index) => {
        var msg = new SpeechSynthesisUtterance();
        msg.text = 'Order ' + order.orderId + 'ready for' + order.customer;
        window.speechSynthesis.speak(msg);
        this.state.ordersToAnnounce.splice(index, 1);
        this.state.announcedOrderIds.push(order.orderID);
      });
    }

    return (
      <div className={classes.page}>
        <div className="flexy-col">
          {this.state.orders.map((order) => {
            return (
              <div className= {(order['status'] === 'Ready') ? "flexy-row ready" : "flexy-row" }>
                <div>
                <Typography variant="h6">
                  <b>{order['customer']}</b>
                </Typography>
                <Typography variant="Subtitle 1">{order['orderId']}</Typography>
                </div>
                <Typography variant="h6">{order['status']}</Typography>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(withSnackbar(BigScreenPage));

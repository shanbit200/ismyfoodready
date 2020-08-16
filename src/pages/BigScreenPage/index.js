import React from 'react';

import {
  withStyles,
  Typography,
  Grid,
  TextField,
  CssBaseline,
  Button,
  Divider,
} from '@material-ui/core';
import BackendHelpers from '../../utils/BackendHelpers';
import { withSnackbar } from 'notistack';
import Select from 'react-select';
import firebase from 'firebase';
import './App.css';
import bag from '../../images/bag.png';
import cooking from '../../images/cooking.gif';

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
    this.state = {
      storeName: props.storeName ? props.storeName : 'Armadillo Willys',
      orders: [],
      announcedOrderIds: [],
      ordersToAnnounce: [],
    };
    console.log(this.state.storeName);
  }

  componentDidMount() {
    this.setState({ loading: true });

    firebase
      .database()
      .ref('store/' + this.state.storeName + '/orders')
      .on('value', (snapshot) => {
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
              !this.state.announcedOrderIds.includes(
                orderObject[key]['orderID']
              )
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
    firebase
      .database()
      .ref('store/' + this.state.storeName + '/orders')
      .off();
  }

  render() {
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
      <div className="flexy-row">
        <div className="flexy-col long-box">
          <div className="flexy-row-short">
            <img src={cooking} alt="bag" height="100" width="100" />
            <Typography variant="h1">
              <b>In Progress</b>
            </Typography>
          </div>
          <Divider height="20px"></Divider>

          {this.state.orders.map((order) => {
            if (order['status'] !== 'Ready') {
              return (
                <div className={'flexy-row '}>
                  <Typography variant="h3">
                    <b>{order['customer']}</b>
                  </Typography>
                  <Typography variant="h3">{order['orderId']}</Typography>
                </div>
              );
            }
          })}
        </div>

        <div className="flexy-col long-box">
          <div className="flexy-row-short">
            <img src={bag} alt="bag" height="100" width="100" />
            <Typography variant="h1">
              <b>Ready</b>
            </Typography>
          </div>
          <Divider height="20px"></Divider>
          {this.state.orders.map((order) => {
            if (order['status'] === 'Ready') {
              return (
                <div className={'flexy-row ready'}>
                  <Typography variant="h3">
                    <b>{order['customer']}</b>
                  </Typography>
                  <Typography variant="h3">{order['orderId']}</Typography>
                </div>
              );
            }
          })}
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(withSnackbar(BigScreenPage));

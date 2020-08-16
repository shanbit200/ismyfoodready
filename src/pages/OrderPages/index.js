import React, { Component } from 'react';
import firebase from 'firebase';
import {
    withStyles,
    Typography,
    CssBaseline,
    Button,
    Fab,
    TextField,
  } from '@material-ui/core';

export default class OrderPage extends Component{
    constructor({orderid, custname, cashname, status, orderitems, fontcolor}){
        super({orderid, custname, cashname, status, orderitems, fontcolor})
        this.database = firebase.database().ref('/store')
        this.state = {
            orderID: orderid,
            custName: custname,
            cashName: cashname,
            status: status,
            orderItems: orderitems,
            fontColor: fontcolor,
        }

    }

    componentDidMount(){
        this.database.on("value", snapshot => {
            let stores = snapshot.val();
            Object.keys(stores).forEach(storeKey => {
              let orders = stores[storeKey].orders;
              Object.keys(orders).forEach(orderKey => {
                console.log(orders[orderKey].orderID)
                if(orders[orderKey].orderID === this.state.orderID)
                {
                  this.setState({status:orders[orderKey].status})
                  console.log(this.state.fontColor)
                  if(this.state.status === "Ready"){
                    this.setState({fontColor:"green"});

                  } else{
                    this.setState({fontColor:"red"});
                  }
                }
              })
            })
            
          })
        
    }

    componentWillUnmount() {
        this.database.off();
      }

    render(){
        return(
            <div>
            <Typography>Order ID: {this.state.orderID}</Typography>
            <Typography>Customer Name: {this.state.custName}</Typography>
            <Typography>Cashier Name: {this.state.cashName}</Typography>
            <Typography>Item Ordered: {this.state.orderItems}</Typography>
            <Typography style={{color:this.state.fontColor}}>Order Status: {this.state.status}</Typography> 
          </div>

        )
    }
}
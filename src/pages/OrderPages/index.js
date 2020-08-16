import React, { Component } from 'react';
import firebase from 'firebase';
import bag from '../../images/bag.png'
import cooking from '../../images/cooking.gif'
import {
    withStyles,
    Typography,
    CssBaseline,
    Button,
    Fab,
    TextField,
    Grid,
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
              <Grid
                container
                direction="row"
                justify="center"
              >
                <div style={{textAlign:'right', paddingRight: '20px'}}>
                  <Grid item xs={12}>
                    <Grid
                    container
                    direction="column"
                    justify="center"
                    >
                      <Typography>Order ID:</Typography>
                      <Typography>Customer Name:</Typography>
                      <Typography>Cashier Name:</Typography>
                      <Typography>Item Ordered:</Typography>
                      <Typography style={{color:this.state.fontColor}}>Order Status:</Typography>
                    </Grid>

                  </Grid>

                </div>
                <div style={{textAlign:'left', paddingBottom: '10px'}}>
                  <Grid item xs={12}>
                    <Grid
                      container
                      direction="column"
                      justify="center"
                    >
                      <Typography>{this.state.orderID}</Typography>
                      <Typography>{this.state.custName}</Typography>
                      <Typography>{this.state.cashName}</Typography>
                      <Typography>{this.state.orderItems}</Typography>
                      <Typography style={{color:this.state.fontColor}}>{this.state.status}</Typography>
                    </Grid>

                  </Grid>
                </div>
              </Grid>

            {this.state.fontColor === "red" ? <img src={cooking}style={{width:'100px', height:'130px'}}></img> : <img src={bag} style={{width:'100px', height:'130px'}}></img> } 
          </div>

        )
    }
}
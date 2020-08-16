import React from 'react';
import {
  withStyles,
  Typography,
  Grid,
  TextField,
  CssBaseline,
  Button,
  Snackbar,
  Card,
  CardActions,
  CardContent,
} from '@material-ui/core';
import Select from 'react-select';
import BackendHelpers from '../../utils/BackendHelpers';
const testData = [
  {
    cashName: 'Joe Biden',
    custName: 'Donald Trump',
    orderID: 'ABCD',
    orderItems: 'Cornpops',
    status: 'InProgress',
  },
  {
    cashName: 'Joe Biden',
    custName: 'Donald Trump',
    orderID: '5XDT',
    orderItems: 'Lard',
    status: 'Ready',
  },
  {
    cashName: 'Joe Biden',
    custName: 'Mike Pence',
    orderID: 'ABCD',
    orderItems: 'Jalepeno Poppers',
    status: 'InProgress',
  },
  {
    cashName: 'Hillary Clinton',
    custName: 'Donald Trump',
    orderID: 'FD56',
    orderItems: '210 Chicken Nuggets',
    status: 'Ready',
  },
  {
    cashName: 'Hillary Clinton',
    custName: 'Mike Pence',
    orderID: 'MMP0',
    orderItems: 'Burger King Foot Lettuce',
    status: 'InProgress',
  },
];

const styles = () => {
  return {
    page: {
      marginLeft: 'auto',
      marginRight: 'auto',
      //maxWidth: 1000,
      width: '95%',
    },
    textField: {
      width: 400,
      maxWidth: '95%',
      '& label.Mui-focused': {
        color: 'grey',
      },
      '& .MuiInput-underline:after': {
        borderBottomColor: 'grey',
      },
      '& .MuiOutlinedInput-root': {
        '&.Mui-focused fieldset': {
          borderColor: 'grey',
        },
      },
    },
    fieldItem: {
      marginTop: '1em',
    },
    addButton: {
      textAlign: 'center',
      marginTop: '2em',
    },
  };
};

class AddTermPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      termError: false,
      definitionError: false,
      showSuccess: false,
      term: '',
      definition: '',
      source: '',
      example: '',
      parent: '',
      options: [],
      ontology: ['All'],
      termSnack: false,
      defSnack: false,
      inProgressOrders: [],
      readyOrders: [],
    };
  }

  handleParentChange = (parent) => {
    let newOntology = [];
    let curr = parent.value;
    while (this.props.definitions[curr]) {
      newOntology.push(curr);
      curr = this.props.definitions[curr].Parent;
    }
    newOntology.push('All');
    newOntology.reverse();
    this.setState({ parent: parent, ontology: newOntology });
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.page}>
        <CssBaseline />
        <Grid container spacing={3}>
          <Grid item xs={4}>
            <Typography variant="h4">
              <b>Add a New Order</b>
            </Typography>
            <div className={classes.fieldItem}>
              <Typography variant="h6">
                <b>Customer Name</b>
              </Typography>
              <TextField
                error={this.state.termError}
                className={classes.textField}
                variant="outlined"
                value={this.state.CustomerName}
                onChange={(evt) =>
                  this.setState({ CustomerName: evt.target.value })
                }
              />
            </div>
            <div className={classes.fieldItem}>
              <Typography variant="h6">
                <b>Cashier Name</b>
              </Typography>
              <TextField
                error={this.state.termError}
                className={classes.textField}
                variant="outlined"
                value={this.state.CashierName}
                onChange={(evt) =>
                  this.setState({ CashierName: evt.target.value })
                }
              />
            </div>
            <div className={classes.fieldItem}>
              <Typography variant="h6">
                <b>Order Items</b>
              </Typography>
              <TextField
                error={this.state.definitionError}
                className={classes.textField}
                variant="outlined"
                multiline
                rows="5"
                value={this.state.OrderItems}
                onChange={(evt) =>
                  this.setState({ OrderItems: evt.target.value })
                }
              />
            </div>
            <div>
              <Button
                className={classes.addButton}
                variant="contained"
                onClick={() => {
                  const id = Math.random()
                    .toString(36)
                    .substring(7)
                    .slice(0, 4)
                    .toUpperCase();
                  BackendHelpers.addOrder(
                    //TODO Populate with the real name
                    'Burger King',
                    id,
                    this.state.CustomerName,
                    this.state.CashierName,
                    this.state.OrderItems,
                    'InProgress'
                  ).then((databaseId) => {
                    this.state.inProgressOrders.push({
                      databaseId,
                      orderId: id,
                      storeName: 'Burger King',
                      custName: this.state.CustomerName,
                      cashName: this.state.CashierName,
                      orderItems: this.state.OrderItems,
                    });
                    this.setState({
                      termError: false,
                      definitionError: false,
                      showSuccess: true,
                      CustomerName: '',
                      CashierName: '',
                      OrderItems: '',
                    });
                  });
                }}
              >
                Add Order
              </Button>
            </div>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h4">
              <b>In Progress</b>
            </Typography>
            <div>
              {this.state.inProgressOrders.map((order, index) => (
                <Card className={classes.root} variant="outlined">
                  <CardContent>
                    <Typography
                      className={classes.title}
                      color="textSecondary"
                      gutterBottom
                    >
                      {order.custName}
                    </Typography>
                    <Typography variant="h5" component="h2">
                      {order.orderItems.toString()}
                    </Typography>
                    <Typography className={classes.pos} color="textSecondary">
                      {order.orderID}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      onClick={() => {
                        this.state.inProgressOrders.splice(index, 1);
                        this.state.readyOrders.push(order);
                        BackendHelpers.updateOrderStatus(
                          order.storeName,
                          order.databaseId,
                          'ready'
                        );
                      }}
                      size="small"
                    >
                      Finish Order
                    </Button>
                  </CardActions>
                </Card>
              ))}
            </div>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h4">
              <b>Fufilled</b>
            </Typography>
            <div>
              {this.state.readyOrders.map((order, index) => (
                <Card className={classes.root} variant="outlined">
                  <CardContent>
                    <Typography
                      className={classes.title}
                      color="textSecondary"
                      gutterBottom
                    >
                      {order.custName}
                    </Typography>
                    <Typography variant="h5" component="h2">
                      {order.orderItems.toString()}
                    </Typography>
                    <Typography className={classes.pos} color="textSecondary">
                      {order.orderID}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      onClick={() => {
                        this.state.readyOrders.splice(index, 1);
                        // TODO: delete from db
                      }}
                      size="small"
                    >
                      Delete Order
                    </Button>
                  </CardActions>
                </Card>
              ))}
            </div>
          </Grid>
        </Grid>
        <Snackbar
          open={this.state.showSuccess}
          onClose={() => this.setState({ showSuccess: false })}
          message="Order Added"
        />
        <Snackbar
          open={this.state.termSnack}
          onClose={() => this.setState({ termSnack: false })}
          message="Error: Invalid Term"
        />
        <Snackbar
          open={this.state.defSnack}
          onClose={() => this.setState({ defSnack: false })}
          message="Error: Invalid Definition"
        />
      </div>
    );
  }
}

const colourStyles = {
  control: (styles) => ({
    ...styles,
    backgroundColor: '#F7F7F7',
    color: 'black',
    width: 400,
    marginTop: 10,
  }),
  option: (styles, { isDisabled, isFocused, isSelected }) => {
    return {
      ...styles,
      backgroundColor: isDisabled
        ? null
        : isSelected
        ? 'grey'
        : isFocused
        ? '#F7F7F7'
        : null,
      ':active': {
        ...styles[':active'],
        backgroundColor: !isDisabled && (isSelected ? 'grey' : 'white'),
      },
    };
  },
};
export default withStyles(styles)(AddTermPage);

import firebase from 'firebase';

const BACKEND_URL = 'https://asl-stem-backend.herokuapp.com';

export default class BackendHelpers {
  // Adds a new store with metadata to the database
  static addStore = (name, storeData) => {
    firebase
      .database()
      .ref('/store/' + name + '/data')
      .set(storeData);
  };

  // Adds order for a specific store
  static addOrder = (
    storeName,
    OrderID,
    CustomerName,
    CashierName,
    OrderItems,
    PhoneNumber,
    OrderStatus
  ) => {
    return new Promise((res, err) => {
      const orderData = {
        orderID: OrderID,
        custName: CustomerName ? CustomerName : '',
        cashName: CashierName ? CashierName : '',
        orderItems: OrderItems ? OrderItems : [],
        phoneNumber: PhoneNumber ? PhoneNumber : '',
        status: OrderStatus ? OrderStatus : 'InProgress',
      };
      firebase
        .database()
        .ref('/store/' + storeName + '/orders')
        .push()
        .then((ref) => {
          ref.set(orderData);
          res(ref.key);
        })
        .catch((error) => err(error));
    });
  };

  static updateOrderStatus = (storeName, itemId, status) => {
    firebase
      .database()
      .ref('/store/' + storeName + '/orders/' + itemId + '/status')
      .set(status);
  };

  static getOrder = (ID) => {
    return new Promise((res, err) => {
      console.log(ID);
      let allData = firebase
        .database()
        .ref('/store')
        .on('value', (snapshot) => {
          let stores = snapshot.val();
          Object.keys(stores).forEach((storeKey) => {
            let orders = stores[storeKey].orders;
            if (orders) {
              Object.keys(orders).forEach((orderKey) => {
                console.log(orders[orderKey].orderID);
                if (orders[orderKey].orderID === ID) {
                  res(orders[orderKey]);
                }
              });
            }
          });
          err('order not found');
        });
    });
  };

  static deleteOrder = (storeName, itemId) => {
    firebase
      .database()
      .ref('/store/' + storeName + '/orders/' + itemId)
      .remove();
  };

  static getStore = (userEmail) => {
    return new Promise((res, err) => {
      firebase
        .database()
        .ref('/store')
        .once('value')
        .then((snapshot) => {
          const stores = snapshot.val();
          if (stores) {
            Object.keys(stores).forEach((storeName) => {
              if (
                stores[storeName].data &&
                stores[storeName].data.authorizedEmployees
              ) {
                const emailList = stores[storeName].data.authorizedEmployees;
                Object.keys(emailList).forEach((index) => {
                  if (userEmail === emailList[index]) {
                    res({
                      storeName: storeName,
                      storeAddress: stores[storeName].data.address,
                    });
                  }
                });
              }
            });
          }

          err('User not registered in any stores.');
        });
    });
  };
}

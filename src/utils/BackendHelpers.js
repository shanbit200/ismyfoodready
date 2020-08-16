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
        custName: CustomerName,
        cashName: CashierName,
        orderItems: OrderItems,
        phoneNumber: PhoneNumber,
        status: OrderStatus,
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

  static deleteOrder = (storeName, itemId) => {
    firebase
      .database()
      .ref('/store/' + storeName + '/orders/' + itemId)
      .remove();
  };
}

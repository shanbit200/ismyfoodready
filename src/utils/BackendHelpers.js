import firebase from 'firebase';

const BACKEND_URL = 'https://asl-stem-backend.herokuapp.com';

export default class BackendHelpers {
  // Adds a new store with metadata to the database
  static addStore = (name, storeData) => {
    // TODO: add validation
    firebase.database().ref('/store/' + name + '/data').set(storeData)
  };

  // Adds order for a specific store
  static addOrder = (storeName, orderData) => {
    firebase.database().ref('/store/' + storeName + '/orders').push().set(orderData)
  }
}

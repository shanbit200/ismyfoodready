import React from 'react';
import { Link } from 'react-router-dom';

class Footer extends React.Component {
  render() {
    return (
      <div
        className="footer"
        style={{
          marginTop: '1rem',
          padding: '1rem',
          backgroundColor: 'rgb(235, 195, 64)',
          position: 'fixed',
          bottom: 0,
          left: 0,
          width: '100%',
        }}
      >
        <Link
          style={{
            marginRight: '1em',
            color: 'black',
            textDecoration: 'none',
          }}
          to="/"
        >
          <u>Home Page</u>
        </Link>
        <Link
          style={{
            marginRight: '1em',
            color: 'black',
            textDecoration: 'none',
          }}
          to="/addStore"
        >
          <u>Register Your Store</u>
        </Link>
        <Link
          style={{
            marginRight: '1em',
            color: 'black',
            textDecoration: 'none',
          }}
          to="/employeeDashboard"
        >
          <u>Employee Login</u>
        </Link>
      </div>
    );
  }
}

export default Footer;

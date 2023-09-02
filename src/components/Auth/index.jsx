import React from 'react';

import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Register from './Register';
import Login from './Login';

export default function AuthComponent() {
  return (
    <Tabs
      defaultActiveKey="login"
      id="fill-tab-example"
      className="mb-3"
      fill
      mountOnEnter
      unmountOnExit
    >
      <Tab eventKey="register" title="Register">
        <Register />
      </Tab>
      <Tab eventKey="login" title="Login">
        <Login />
      </Tab>
    </Tabs>
  );
}

import React from 'react';
import { Container, Tabs, Tab } from 'react-bootstrap';
import BooksTab from './BooksTab';
import OrdersTab from './OrdersTab';

export default function Moderator() {
  return (
    <Container fluid className="my-3">
      <Tabs
        defaultActiveKey="books"
        id="uncontrolled-tab-example"
        className="mb-3"
        justify
        mountOnEnter
      >
        <Tab eventKey="books" title="Books">
          <BooksTab />
        </Tab>
        <Tab eventKey="merch" title="Merch">
          Soon
        </Tab>
        <Tab eventKey="orders" title="Orders">
          <OrdersTab />
        </Tab>
      </Tabs>
    </Container>
  );
}

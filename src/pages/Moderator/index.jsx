import React, { useContext } from 'react';
import {
  Container, Tabs, Tab,
} from 'react-bootstrap';
import BooksTab from './BooksTab';
import OrdersTab from './OrdersTab';
import AppContext from '../../appContext';
import NewsTab from './NewsTab';
import MerchTab from './MerchTab';

export default function Moderator() {
  const { state } = useContext(AppContext);
  const userRoles = state?.currentUser?.roles;
  return (
    <Container fluid className="my-3">
      <Tabs
        defaultActiveKey="books"
        id="uncontrolled-tab-example"
        className="mb-3"
        justify
        mountOnEnter
      >
        <Tab eventKey="orders" title="Orders">
          <OrdersTab />
        </Tab>
        <Tab
          eventKey="books"
          title="Books"
          disabled={userRoles.some((role) => role === 'ROLE_SELLER')
            && !userRoles.some((role) => role === 'ROLE_MODERATOR') && !userRoles.some((role) => role === 'ROLE_ADMIN')}
        >
          <BooksTab />
        </Tab>
        <Tab
          eventKey="merch"
          title="Merch"
          disabled={userRoles.some((role) => role === 'ROLE_SELLER')
            && !userRoles.some((role) => role === 'ROLE_MODERATOR') && !userRoles.some((role) => role === 'ROLE_ADMIN')}
        >
          <MerchTab />
        </Tab>
        <Tab
          eventKey="news"
          title="News"
          disabled={userRoles.some((role) => role === 'ROLE_SELLER')
            && !userRoles.some((role) => role === 'ROLE_MODERATOR') && !userRoles.some((role) => role === 'ROLE_ADMIN')}
        >
          <NewsTab />
        </Tab>

      </Tabs>
    </Container>
  );
}

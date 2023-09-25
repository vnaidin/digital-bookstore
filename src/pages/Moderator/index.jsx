import React, { useContext } from 'react';
import {
  Container, Tabs, Tab,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import BooksTab from './BooksTab';
import OrdersTab from './OrdersTab';
import AppContext from '../../appContext';
import NewsTab from './NewsTab';
import MerchTab from './MerchTab';

export default function Moderator() {
  const { state } = useContext(AppContext);
  const { t } = useTranslation();
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
        <Tab eventKey="orders" title={t('pages.order.title')}>
          <OrdersTab />
        </Tab>
        <Tab
          eventKey="books"
          title={t('pages.mainPage.books')}
          disabled={userRoles.some((role) => role === 'ROLE_SELLER')
            && !userRoles.some((role) => role === 'ROLE_MODERATOR') && !userRoles.some((role) => role === 'ROLE_ADMIN')}
        >
          <BooksTab />
        </Tab>
        <Tab
          eventKey="merch"
          title={t('pages.merch.title')}
          disabled={userRoles.some((role) => role === 'ROLE_SELLER')
            && !userRoles.some((role) => role === 'ROLE_MODERATOR') && !userRoles.some((role) => role === 'ROLE_ADMIN')}
        >
          <MerchTab />
        </Tab>
        <Tab
          eventKey="news"
          title={t('pages.news.title')}
          disabled={userRoles.some((role) => role === 'ROLE_SELLER')
            && !userRoles.some((role) => role === 'ROLE_MODERATOR') && !userRoles.some((role) => role === 'ROLE_ADMIN')}
        >
          <NewsTab />
        </Tab>

      </Tabs>
    </Container>
  );
}

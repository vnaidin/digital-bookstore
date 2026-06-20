import { useTranslation } from 'react-i18next';
import { Container, Tabs } from '@mantine/core';

import { useAppSelector } from '@/store';

import CatalogTab from './CatalogTab';
import OrdersTab from './OrdersTab';

export default function Moderator() {
  const user = useAppSelector((s) => s.user);
  const { t } = useTranslation();
  const userRoles = user?.roles ?? [];
  const isSeller = userRoles.some((r) => r === 'ROLE_SELLER');
  const isModOrAdmin = userRoles.some((r) => r === 'ROLE_MODERATOR' || r === 'ROLE_ADMIN');
  const catalogDisabled = isSeller && !isModOrAdmin;

  return (
    <Container fluid my="sm">
      <Tabs defaultValue="orders" keepMounted={false}>
        <Tabs.List grow mb="md">
          <Tabs.Tab value="orders">{t('pages.order.title')}</Tabs.Tab>
          <Tabs.Tab value="books" disabled={catalogDisabled}>{t('pages.books.title')}</Tabs.Tab>
          <Tabs.Tab value="merch" disabled={catalogDisabled}>{t('pages.merch.title')}</Tabs.Tab>
          <Tabs.Tab value="news" disabled={catalogDisabled}>{t('pages.news.title')}</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="orders"><OrdersTab /></Tabs.Panel>
        <Tabs.Panel value="books"><CatalogTab entityType="book" /></Tabs.Panel>
        <Tabs.Panel value="merch"><CatalogTab entityType="merch" /></Tabs.Panel>
        <Tabs.Panel value="news"><CatalogTab entityType="news" /></Tabs.Panel>
      </Tabs>
    </Container>
  );
}

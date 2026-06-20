import { useTranslation } from 'react-i18next';
import { Container, Tabs } from '@mantine/core';

import { useAppSelector } from '@/store';
import { selectIsModerator, selectIsSeller } from '@/store/user';

import CatalogTab from './CatalogTab';
import OrdersTab from './OrdersTab';

export default function Moderator() {
  const isSeller = useAppSelector(selectIsSeller);
  const isModOrAdmin = useAppSelector(selectIsModerator);
  const { t } = useTranslation();
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

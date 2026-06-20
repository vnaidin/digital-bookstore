import { useTranslation } from 'react-i18next';
import { Table } from '@mantine/core';

import { Order } from '@/types';

import { UserOrderRow } from '../';

interface Props {
  orders: Order[];
}

export default function UserView({ orders }: Props) {
  const { t } = useTranslation();
  const hasTracking = orders[0]?.status === 2;

  return (
    <Table highlightOnHover withTableBorder withColumnBorders>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>ID</Table.Th>
          <Table.Th>{t('pages.orderPage.table.items')}</Table.Th>
          <Table.Th>{t('pages.orderPage.table.status')}</Table.Th>
          {hasTracking && <Table.Th>Tracking</Table.Th>}
          <Table.Th>{t('pages.orderPage.table.hasPaid')}</Table.Th>
          <Table.Th>{t('pages.orderPage.table.created')}</Table.Th>
          <Table.Th>{t('pages.orderPage.table.updated')}</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {orders.map((order, ind) => (
          <UserOrderRow key={order?.id} order={order} ind={ind} />
        ))}
      </Table.Tbody>
    </Table>
  );
}

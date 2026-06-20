import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Table } from '@mantine/core';

import { OrderTableLine, UpdateOrderModal } from '@/components';
import { Order } from '@/types';

interface Props {
  order: Order;
}

export default function SellerView({ order }: Props) {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {showModal && (
        <UpdateOrderModal existingOrder={order} handleCloseModal={() => setShowModal(false)} />
      )}
      <Table highlightOnHover withTableBorder withColumnBorders>
        <Table.Thead>
          <Table.Tr>
            <Table.Th />
            <Table.Th>#</Table.Th>
            <Table.Th>{t('pages.orderPage.table.name')}</Table.Th>
            <Table.Th>{t('pages.orderPage.table.surname')}</Table.Th>
            <Table.Th>{t('pages.orderPage.table.email')}</Table.Th>
            <Table.Th>{t('pages.orderPage.table.price')}</Table.Th>
            <Table.Th>{t('pages.orderPage.table.status')}</Table.Th>
            <Table.Th>{t('pages.orderPage.table.hasPaid')}</Table.Th>
            <Table.Th>{t('pages.orderPage.table.created')}</Table.Th>
            <Table.Th>{t('pages.orderPage.table.actions')}</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <OrderTableLine
            order={order}
            handleOrderUpdate={() => setShowModal(true)}
            handleCloseModal={() => setShowModal(false)}
          />
        </Table.Tbody>
      </Table>
    </>
  );
}

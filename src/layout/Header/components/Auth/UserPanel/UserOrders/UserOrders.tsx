import { useTranslation } from 'react-i18next';
import { Box, Table, Text, Title } from '@mantine/core';

import { LoadingComponent, NoDataComponent, OrderItemsCell, PayButton } from '@/components';
import { useGetOrderByIdQuery } from '@/store/api';

interface Props {
  userId: number;
}

export default function UserOrders({ userId }: Props) {
  const { t } = useTranslation();
  const { data: orders, isLoading, error } = useGetOrderByIdQuery(`all/${userId}`);

  return (
    <Box>
      {orders && (
        <Title order={5} ta="center" mb="sm">
          {t('layout.headerBottom.auth.ordersTable.title')}
        </Title>
      )}
      {error && <Text c="red">{String(error)}</Text>}
      {isLoading && <LoadingComponent />}
      {orders && orders.length > 0 ? (
        <Table striped withTableBorder withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>#</Table.Th>
              <Table.Th>{t('layout.headerBottom.auth.ordersTable.items')}</Table.Th>
              <Table.Th>{t('layout.headerBottom.auth.ordersTable.price')}</Table.Th>
              <Table.Th>{t('layout.headerBottom.auth.ordersTable.status')}</Table.Th>
              <Table.Th>{t('layout.headerBottom.auth.ordersTable.hasPaid')}</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {orders.map((order, ind) => (
              <Table.Tr key={order.id}>
                <Table.Td>{ind + 1}</Table.Td>
                <OrderItemsCell items={order.order_items} />
                <Table.Td>{order.price}</Table.Td>
                <Table.Td>{t(`constants.orderStatus.${order.status}`)}</Table.Td>
                <Table.Td>
                  {Number(order.paymentMethodId) === 1 && order.status <= 1
                    ? <PayButton order={order} />
                    : <Text>-</Text>}
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      ) : (
        <NoDataComponent />
      )}
    </Box>
  );
}

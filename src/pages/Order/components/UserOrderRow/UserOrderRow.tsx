import { useTranslation } from 'react-i18next';
import { Anchor, Table } from '@mantine/core';

import { OrderItemsCell, PayButton } from '@/components';
import { DELIVERY_METHODS } from '@/settings';
import { Order } from '@/types';

interface Props {
  order: Order;
  ind: number;
}

export default function UserOrderRow({ order, ind }: Props) {
  const { t } = useTranslation();
  const trackUrl = DELIVERY_METHODS.find((m) => m.id === order.order_address?.delMethodId)?.trackUrl;

  return (
    <Table.Tr>
      <Table.Td>{ind + 1}</Table.Td>
      <OrderItemsCell items={order?.order_items} />
      <Table.Td>{t(`constants.orderStatus.${order.status}`)}</Table.Td>
      {order.status === 2 && (
        <Table.Td>
          <Anchor href={trackUrl + order.ttn} target="_blank" rel="noopener noreferrer">link</Anchor>
        </Table.Td>
      )}
      <Table.Td>
        {Number(order.paymentMethodId) === 1 ? <PayButton order={order} /> : '-'}
      </Table.Td>
      <Table.Td>{new Date(order?.createdAt).toLocaleString()}</Table.Td>
      <Table.Td>{new Date(order?.updatedAt).toLocaleString()}</Table.Td>
    </Table.Tr>
  );
}

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Anchor, Button, Group, NativeSelect, Table, Text, TextInput, Tooltip } from '@mantine/core';

import { LoadingComponent, NoDataComponent } from '@/components';
import toast from 'react-hot-toast';
import { useDeletePromoCodeMutation, useGetOrdersQuery, useSearchOrdersQuery } from '@/store/api';
import { DELIVERY_METHODS, ORDER_STATUSES } from '@/utils/constants';
import { useDebounce, useOrderItems } from '@/hooks';

import UpdateOrderModal from './UpdateOrderModal';

export default function OrdersTab() {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const [currentOrder, updateOrderObject] = useState<any>(null);
  const [search, updSearch] = useState('');
  const debouncedSearch = useDebounce(search, 600);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const ordersQuery = useGetOrdersQuery(statusFilter ? { status: statusFilter } : {});
  const searchQuery = useSearchOrdersQuery(debouncedSearch, { skip: debouncedSearch.length < 2 });
  const { data: value, isLoading, error } = debouncedSearch.length > 1 ? searchQuery : ordersQuery;

  const handleCloseModal = () => { setShowModal(false); updateOrderObject(null); };
  const handleOrderUpdate = (id: number) => {
    setShowModal(true);
    updateOrderObject(value?.find((order) => order.id === id));
  };

  return (
    <>
      {showModal && <UpdateOrderModal existingOrder={currentOrder} handleCloseModal={handleCloseModal} />}
      <Group mb="sm">
        <TextInput flex={1} size="lg" placeholder="Name, Surname or TelNumber" onChange={(e) => updSearch(e.target.value)} autoComplete="off" />
        <NativeSelect
          label={t('pages.moderator.tabs.order.filter')}
          onChange={(e) => setStatusFilter(Number.isNaN(Number(e.target.value)) ? null : e.target.value || null)}
          data={[
            { value: '', label: `${t('pages.moderator.tabs.order.filter-p')}:` },
            ...Object.entries(ORDER_STATUSES).map(([id]) => ({ value: id, label: t(`constants.orderStatus.${id}`) })),
          ]}
        />
      </Group>
      {error && <p>{String(error)}</p>}
      {isLoading && <LoadingComponent />}
      {value && value.length > 0 ? (
        <Table bordered highlightOnHover withTableBorder withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th />
              <Table.Th>#</Table.Th>
              <Table.Th>{t('pages.moderator.tabs.order.table.name')}</Table.Th>
              <Table.Th>{t('pages.moderator.tabs.order.table.surname')}</Table.Th>
              <Table.Th>{t('pages.moderator.tabs.order.table.email')}</Table.Th>
              <Table.Th>{t('pages.moderator.tabs.order.table.price')}</Table.Th>
              <Table.Th>{t('pages.moderator.tabs.order.table.status')}</Table.Th>
              <Table.Th>{t('pages.moderator.tabs.order.table.hasPaid')}</Table.Th>
              <Table.Th>{t('pages.moderator.tabs.order.table.created')}</Table.Th>
              <Table.Th>{t('pages.moderator.tabs.order.table.actions')}</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {value.map((order) => (
              <OrderTableLine key={order.id} order={order} handleOrderUpdate={handleOrderUpdate} handleCloseModal={handleCloseModal} />
            ))}
          </Table.Tbody>
        </Table>
      ) : <NoDataComponent />}
    </>
  );
}

export function OrderTableLine({ order, handleOrderUpdate, handleCloseModal }: { order: any; handleOrderUpdate: (id: number) => void; handleCloseModal: () => void }) {
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const { t } = useTranslation();
  return (
    <>
      <Table.Tr>
        <Table.Td>
          <Tooltip label="Order Items">
            <button type="button" style={{ cursor: 'pointer', border: 'none', background: 'none' }} onClick={() => setShowMoreInfo((p) => !p)}>+</button>
          </Tooltip>
        </Table.Td>
        <Table.Td>{order.id}</Table.Td>
        <Table.Td>{order.name}</Table.Td>
        <Table.Td>{order.surname}</Table.Td>
        <Table.Td>{order.email}</Table.Td>
        <Table.Td>{order.price}</Table.Td>
        <Table.Td>{t(`constants.orderStatus.${order.status}`)}</Table.Td>
        <Table.Td>{Boolean(order.hasPaid).toString()}</Table.Td>
        <Table.Td>{new Date(order.createdAt).toLocaleString()}</Table.Td>
        <Table.Td>
          <Button size="xs" color="yellow" onClick={() => handleOrderUpdate(order.id)}>{t('pages.moderator.tabs.order.modal.update')}</Button>
        </Table.Td>
      </Table.Tr>
      {showMoreInfo && (
        <OrderMoreInfoLine orderId={order.id} items={order.order_items} address={order.order_address} phoneNumber={order.phoneNumber} comments={order.comments} promocode={order.promocode}
          receiver={order.receiverName ? `${order.receiverName} ${order.receiverSurname} (${order.receiverPhoneNumber})` : null} handleCloseModal={handleCloseModal} />
      )}
    </>
  );
}

function OrderMoreInfoLine({ items, address, phoneNumber, comments, receiver, promocode, orderId, handleCloseModal }: {
  items: { itemId: number; price: number }[];
  address: any;
  phoneNumber: string;
  comments?: string;
  receiver?: string;
  promocode?: string;
  orderId?: number;
  handleCloseModal: () => void;
}) {
  const { t } = useTranslation();
  const [deletePromoCode] = useDeletePromoCodeMutation();
  const orderItemsToShow = useOrderItems(items);

  const currentDeliveryMethod = DELIVERY_METHODS.find((m) => m.id === address?.delMethodId);

  return (
    <Table.Tr>
      <Table.Td> </Table.Td>
      <Table.Td colSpan={8}>
        <Group my="xs" gap="lg" wrap="wrap">
          <Text><strong>{t('pages.moderator.tabs.order.table.more-info-line.delivery')}:</strong> <u>{currentDeliveryMethod?.title}</u></Text>
          <Text><strong>{t('pages.moderator.tabs.order.table.more-info-line.address')}:</strong>
            <u>{currentDeliveryMethod?.stateFullAddress ? ` ${address.city}, ${address.street}, ${address.houseNr}, ${address.flatNr}` : ` ${address.city}, ${address.branch}`}</u></Text>
          <Text><strong>{t('pages.moderator.tabs.order.table.more-info-line.tel')}:</strong> <Anchor href={`tel:${phoneNumber}`} rel="nofollow">{phoneNumber}</Anchor></Text>
        </Group>
        {receiver && <Text my="xs">{t('pages.moderator.tabs.order.table.more-info-line.receiver')}: {receiver}</Text>}
        <div>
          {orderItemsToShow.length > 0 ? orderItemsToShow.map((item, index) => (
            <Text key={item.id}>{`${index + 1}. ${item.author ?? ''}, ${item.title} ${item.amount > 1 ? `(${item.amount} items)` : ''}`}</Text>
          )) : <NoDataComponent />}
        </div>
        {comments && <Text my="xs">{t('pages.moderator.tabs.order.table.more-info-line.comments')}: {comments}</Text>}
        {promocode && (
          <Group my="xs">
            <Text>Promocode: <strong>{String(promocode).toUpperCase()}</strong></Text>
            <Button size="xs" color="red" onClick={() => {
              deletePromoCode({ orderId: orderId!, promocode }).unwrap()
                .then((res) => { toast.success(res.message ?? ''); handleCloseModal(); })
                .catch((err) => console.error(err));
            }}>Delete</Button>
          </Group>
        )}
      </Table.Td>
    </Table.Tr>
  );
}

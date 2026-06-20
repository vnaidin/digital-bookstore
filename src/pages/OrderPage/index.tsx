import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Anchor, Container, Table, Title } from '@mantine/core';

import { LoadingComponent, NoDataComponent } from '@/components';
import { OrderItemsCell } from '@/layout/HeaderBottom/Auth/UserPanel';
import { useAppSelector } from '@/store';
import { useGetOrderByIdQuery } from '@/store/api';
import { post_to_url } from '@/utils/helpers';
import { DELIVERY_METHODS } from '@/utils/constants';
import { toBinary } from '@/utils/helpers';

import { OrderTableLine } from '../Moderator/OrdersTab';
import UpdateOrderModal from '../Moderator/UpdateOrderModal';

export default function OrderPage() {
  const user = useAppSelector((s) => s.user);
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const [showModal, setShowModal] = useState(false);
  const { data: value, isLoading, error } = useGetOrderByIdQuery(id!, { skip: !id, refetchOnMountOrArgChange: true });

  const isNotOrdinaryUser = user?.roles.some((role) => role === 'ROLE_SELLER');
  const { REACT_APP_LIQ_PAY_PUBLIC, REACT_APP_LIQ_PAY_PRIVATE, REACT_APP_BE_URL } = import.meta.env;

  return (
    <Container>
      <title>{t('pages.orderPage.title') + new Date(value ? value[0]?.createdAt : null).toLocaleString()}</title>
      {showModal && value && (
        <UpdateOrderModal existingOrder={value[0]} handleCloseModal={() => setShowModal(false)} />
      )}
      {error && <p>{String(error)}</p>}
      {isLoading && <LoadingComponent />}
      <Title order={3} ta="center" my="md">{t('pages.order.title')}</Title>
      {value && value.length > 0 ? (
        <Table bordered highlightOnHover withTableBorder withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              {isNotOrdinaryUser ? (
                <>
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
                </>
              ) : (
                <>
                  <Table.Th>ID</Table.Th>
                  <Table.Th>{t('pages.orderPage.table.items')}</Table.Th>
                  <Table.Th>{t('pages.orderPage.table.status')}</Table.Th>
                  {value[0]?.status === 2 && <Table.Th>Tracking</Table.Th>}
                  <Table.Th>{t('pages.orderPage.table.hasPaid')}</Table.Th>
                  <Table.Th>{t('pages.orderPage.table.created')}</Table.Th>
                  <Table.Th>{t('pages.orderPage.table.updated')}</Table.Th>
                </>
              )}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {isNotOrdinaryUser ? (
              <OrderTableLine order={value[0]} handleOrderUpdate={() => setShowModal(true)} handleCloseModal={() => setShowModal(false)} />
            ) : value.map((order, ind) => (
              <Table.Tr key={order?.id}>
                <Table.Td>{ind + 1}</Table.Td>
                <OrderItemsCell items={order?.order_items} />
                <Table.Td>{t(`constants.orderStatus.${order.status}`)}</Table.Td>
                {order.status === 2 && (
                  <Table.Td>
                    <Anchor href={DELIVERY_METHODS.find((m) => m.id === order.order_address?.delMethodId)?.trackUrl + order.ttn} target="_blank" rel="noopener noreferrer">link</Anchor>
                  </Table.Td>
                )}
                <Table.Td>
                  {Number(order.paymentMethodId) === 1 ? (
                    order.hasPaid != null ? (
                      <p>{t('pages.orderPage.table.hasPaid-yes')}</p>
                    ) : (
                      <button
                        type="button"
                        className="button"
                        onClick={() => {
                          const jsonData = {
                            public_key: REACT_APP_LIQ_PAY_PUBLIC,
                            version: '3',
                            action: 'pay',
                            amount: order.price,
                            currency: 'UAH',
                            description: 'Оплата за книги',
                            result_url: window.location.origin,
                            server_url: `${REACT_APP_BE_URL}/api/order/payment-update`,
                            language: 'uk',
                            order_id: String(order.id),
                          };
                          const liqpayData = window.btoa(toBinary(JSON.stringify(jsonData)));
                          const signString = REACT_APP_LIQ_PAY_PRIVATE + liqpayData + REACT_APP_LIQ_PAY_PRIVATE;
                          import('crypto').then(({ createHash }) => {
                            const signature = createHash('sha1').update(signString).digest('base64');
                            post_to_url('https://www.liqpay.ua/api/3/checkout', { submit: 'submit', data: liqpayData, signature });
                          });
                        }}
                      >
                        {t('pages.orderPage.table.pay')}
                      </button>
                    )
                  ) : '-'}
                </Table.Td>
                <Table.Td>{new Date(order?.createdAt).toLocaleString()}</Table.Td>
                <Table.Td>{new Date(order?.updatedAt).toLocaleString()}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      ) : <NoDataComponent />}
    </Container>
  );
}

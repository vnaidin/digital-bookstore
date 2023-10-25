import crypto from 'crypto';
import React, { useContext, useState } from 'react';
import {
  Button,
  Container, Row, Table,
} from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { useFetch } from '../../utils/hooks';
import { OrderItemsCell } from '../../layout/HeaderBottom/Auth/UserPanel';
import AppContext from '../../appContext';
import { OrderTableLine } from '../Moderator/OrdersTab';
import UpdateOrderModal from '../Moderator/UpdateOrderModal';
import { LoadingComponent, NoDataComponent } from '../../components';
import { toBinary } from '../../utils/helpers';
import { post_to_url } from '../../utils/axios';
import { DELIVERY_METHODS } from '../../utils/constants';

export default function OrderPage() {
  const { state } = useContext(AppContext);
  const { t } = useTranslation();
  const { id } = useParams();
  const [showModal, setShowModal] = useState(false);
  const { loading, error, value } = useFetch(
    `${process.env.REACT_APP_BE_URL}/api/order/${id}`,
    {},
    [showModal],
  );
  const isNotOrdinaryUser = state?.currentUser?.roles.some((role) => role === 'ROLE_SELLER');

  const { REACT_APP_LIQ_PAY_PUBLIC, REACT_APP_LIQ_PAY_PRIVATE, REACT_APP_BE_URL } = process.env;

  return (
    <Container>
      <Helmet>
        <title>{t('pages.orderPage.title') + new Date(value ? value[0]?.createdAt : null).toLocaleString()}</title>
      </Helmet>

      {showModal && (
        <UpdateOrderModal
          existingOrder={value ? value[0] : {}}
          handleCloseModal={() => setShowModal(false)}
        />
      )}

      <Row className="my-2">
        {error && (
          <p>
            {new Error(error).message}
          </p>
        )}
        {loading && (
        <LoadingComponent />
        )}
      </Row>

      <Row className="my-3">
        <h3 className="text-center my-2">{t('pages.order.title')}</h3>
        {value && value[0] !== null && value.length > 0 ? (
          <Table
            /* striped */
            bordered
            hover
            responsive
            size="sm"
          >
            <thead>
              <tr>
                {isNotOrdinaryUser ? (
                  <>
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                    <th />
                    <th>#</th>
                    <th>{t('pages.orderPage.table.name')}</th>
                    <th>{t('pages.orderPage.table.surname')}</th>
                    <th>{t('pages.orderPage.table.email')}</th>
                    <th>{t('pages.orderPage.table.price')}</th>
                    <th>{t('pages.orderPage.table.status')}</th>
                    <th>{t('pages.orderPage.table.hasPaid')}</th>
                    <th>{t('pages.orderPage.table.created')}</th>
                    <th>{t('pages.orderPage.table.actions')}</th>
                  </>
                ) : (
                  <>
                    {' '}
                    <th>ID</th>
                    <th>{t('pages.orderPage.table.items')}</th>
                    <th>{t('pages.orderPage.table.status')}</th>
                    {value[0].status === 2 ? <th>Tracking</th> : undefined}
                    <th>{t('pages.orderPage.table.hasPaid')}</th>
                    <th>{t('pages.orderPage.table.created')}</th>
                    <th>{t('pages.orderPage.table.updated')}</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {isNotOrdinaryUser ? (
                <OrderTableLine
                  order={value[0]}
                  handleOrderUpdate={() => setShowModal(true)}
                />
              ) : value.map((order, ind) => (
                <tr key={order?.id}>
                  <td>{ind + 1}</td>
                  <OrderItemsCell items={order?.order_items} />
                  <td>{t(`constants.orderStatus.${order.status}`)}</td>
                  {order.status === 2 && (
                    <td>
                      <a
                        href={DELIVERY_METHODS.find(
                          (method) => method.id === order.order_address.delMethodId,
                        ).trackUrl + order.ttn}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        link
                      </a>
                    </td>
                  )}
                  <td>
                    {/* eslint-disable-next-line no-nested-ternary */}
                    {Number(order.paymentMethodId) === 1 ? order.hasPaid != null ? <p>{t('pages.orderPage.table.hasPaid-yes')}</p> : (
                      <Button
                        className="button"
                        onClick={() => {
                          const json_string = {
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
                          const liqpayData = window.btoa(toBinary(JSON.stringify(json_string)));
                          // console.log('liqpayData', liqpayData);
                          const sign_string = REACT_APP_LIQ_PAY_PRIVATE
                          + liqpayData + REACT_APP_LIQ_PAY_PRIVATE;
                          const sha1 = crypto.createHash('sha1');
                          sha1.update(sign_string);
                          const signature = sha1.digest('base64');
                          post_to_url('https://www.liqpay.ua/api/3/checkout', { submit: 'submit', data: liqpayData, signature });
                        }}
                      >
                        {t('pages.orderPage.table.pay')}
                      </Button>
                    ) : '-'}
                  </td>
                  <td>{new Date(order?.createdAt).toLocaleString()}</td>
                  <td>{new Date(order?.updatedAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : <NoDataComponent />}
      </Row>
    </Container>
  );
}

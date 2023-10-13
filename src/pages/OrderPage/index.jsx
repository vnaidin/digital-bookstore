import React, { useContext, useState } from 'react';
import {
  Container, Row, Spinner, Table,
} from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { useFetch } from '../../utils/hooks';
import { OrderItemsCell } from '../../layout/HeaderBottom/Auth/UserPanel';
import AppContext from '../../appContext';
import { OrderTableLine } from '../Moderator/OrdersTab';
import UpdateOrderModal from '../Moderator/UpdateOrderModal';
import { NoDataComponent } from '../../components';

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
  return (
    <Container>
      <Helmet>
        <title>{t('pages.orderPage.title') + new Date(value ? value[0].createdAt : null).toLocaleString()}</title>
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
        <Spinner animation="border" />
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

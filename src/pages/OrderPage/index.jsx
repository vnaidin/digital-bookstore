import React, { useContext, useState } from 'react';
import {
  Container, Row, Spinner, Table,
} from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useFetch } from '../../utils/hooks';
import { ORDER_STATUSES } from '../../utils/constants';
import { OrderItemsCell } from '../../layout/HeaderBottom/Auth/UserPanel';
import AppContext from '../../appContext';
import { OrderTableLine } from '../Moderator/OrdersTab';
import UpdateOrderModal from '../Moderator/UpdateOrderModal';

export default function OrderPage() {
  const { state } = useContext(AppContext);
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
        <title>Order</title>
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
        <h3 className="text-center my-2">Orders</h3>
        {value && value[0] !== null && value.length > 0 ? (
          <Table
            striped
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
                    <th>Name</th>
                    <th>Surname</th>
                    <th>Email</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </>
                ) : (
                  <>
                    {' '}
                    <th>ID</th>
                    <th>Items</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Updated</th>
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
                  <td>{ORDER_STATUSES[+order.status].title}</td>
                  <td>{new Date(order?.createdAt).toLocaleString()}</td>
                  <td>{new Date(order?.updatedAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : <h4>No Data...</h4>}
      </Row>
    </Container>
  );
}

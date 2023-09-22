import React, { useContext } from 'react';
import {
  Container, Row, Spinner, Table,
} from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useFetch } from '../../utils/hooks';
import { ORDER_STATUSES } from '../../utils/constants';
import { OrderItemsCell } from '../../layout/HeaderBottom/Auth/UserPanel';
import AppContext from '../../appContext';

export default function OrderPage() {
  // eslint-disable-next-line no-unused-vars
  const { state } = useContext(AppContext);
  // console.log('roles', state?.currentUser?.roles);
  // TODO: add more informative table for MODERATOR
  const { id } = useParams();
  const { loading, error, value } = useFetch(
    `${process.env.REACT_APP_BE_URL}/api/order/${id}`,
    {},
    [],
  );

  return (
    <Container>
      <Helmet>
        <title>Order</title>
      </Helmet>

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
                <th>ID</th>
                <th>Items</th>
                {/* <th>Price</th> */}
                <th>Status</th>
                <th>Created</th>
                <th>Updated</th>
              </tr>
            </thead>
            <tbody>
              {value.map((order, ind) => (
                <tr key={order?.id}>
                  <td>{ind + 1}</td>
                  <OrderItemsCell items={order?.order_items} />
                  {/* <td>{order?.price}</td> */}
                  <td>{ORDER_STATUSES[order?.status]}</td>
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

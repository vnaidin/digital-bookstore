/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import {
  Button, Container, Table, Spinner, OverlayTrigger, Tooltip, ListGroup, Row, Col,
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useFetch } from '../../utils/hooks';
import authHeader from '../../services/auth-header';
import { DELIVERY_METHODS, ORDER_STATUSES } from '../../utils/constants';
import UpdateOrderModal from './UpdateOrderModal';

export default function OrdersTab() {
  const [showModal, setShowModal] = useState(false);
  const [currentOrder, updateOrderObject] = useState();

  const handleCloseModal = () => { setShowModal(false); updateOrderObject(null); };
  const handleOpenModal = () => setShowModal(true);
  const { loading, error, value } = useFetch(
    `${process.env.REACT_APP_BE_URL}/all/orders`,
    { headers: authHeader() },
    [showModal],
  );

  const handleOrderUpdate = (id) => {
    handleOpenModal(); updateOrderObject(value.find((order) => order.id === id));
  };
  return (
    <>
      {showModal && (
      <UpdateOrderModal
        existingOrder={currentOrder}
        handleCloseModal={handleCloseModal}
      />
      )}
      <Container>
        <Table
          striped
          bordered
          hover
          responsive
        >
          <thead>
            <tr>
              {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
              <th />
              <th>#</th>
              <th>Name</th>
              <th>Surname</th>
              <th>Email</th>
              <th>Tel</th>
              <th>Price</th>
              <th>Comments</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {value && value.map((order) => (
              <OrderTableLine
                key={order.id}
                order={order}
                handleOrderUpdate={handleOrderUpdate}
              />
            ))}
          </tbody>
        </Table>
      </Container>
    </>
  );
}

function OrderTableLine({ order, handleOrderUpdate }) {
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  return (
    <>
      <tr>
        <td className="d-flex justify-content-center">
          <OverlayTrigger
            placement="top"
            overlay={(
              <Tooltip
                id="button-tooltip-2"
              >
                Order Items
                {' '}
              </Tooltip>
)}
          >
            {({ ref, ...triggerHandler }) => (
              <button
// eslint-disable-next-line react/jsx-props-no-spreading
                {...triggerHandler}
                ref={ref}
                style={{
                  cursor: 'pointer',
                  border: 'none',
                }}
                type="button"
                onClick={() => setShowMoreInfo((prev) => !prev)}
              >
                +
              </button>
            )}
          </OverlayTrigger>
        </td>
        <td>{order.id}</td>
        <td>{order.name}</td>
        <td>{order.surname}</td>
        <td>{order.email}</td>
        <td>{order.phoneNumber}</td>
        <td>{order.price}</td>
        <td>{order.comments}</td>
        <td>{ORDER_STATUSES[order.status]}</td>
        <td className="d-flex gap-1">
          <Button variant="warning" onClick={() => { handleOrderUpdate(order.id); }}>Update</Button>
        </td>
      </tr>
      {showMoreInfo && (
      <OrderMoreInfoLine
        items={order.items}
        delMethod={order.delMethod}
        city={order.city}
        branch={order.branch}
        address={order.address}
      />
      )}
    </>
  );
}
OrderTableLine.defaultProps = {
};

OrderTableLine.propTypes = {
  order: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    surname: PropTypes.string,
    email: PropTypes.string,
    phoneNumber: PropTypes.string,
    delMethod: PropTypes.number,
    city: PropTypes.string,
    branch: PropTypes.string,
    address: PropTypes.string,
    comments: PropTypes.string,
    price: PropTypes.number,
    status: PropTypes.number,
    items: PropTypes.string,
  }).isRequired,
  handleOrderUpdate: PropTypes.func.isRequired,
};

function OrderMoreInfoLine({
  items, delMethod, city, branch, address,
}) {
  const { loading, error, value } = useFetch(
    `${process.env.REACT_APP_BE_URL}/items/order?items=${encodeURI(items)}`,
    {},
    [],
  );
  const itemsAmountById = items.split(',').reduce((prev, cur) => {
    // eslint-disable-next-line no-param-reassign
    prev[cur] = (prev[cur] || 0) + 1;
    return prev;
  }, {});
  return (
    <tr>
      <td>{' '}</td>
      <td colSpan={5}>
        {error && (
        <p>
          {new Error(error).message}
        </p>
        )}
        {loading && (
        <Spinner animation="border" />
        )}
        <Row className="my-3 gap-1">
          <Col>
            <strong>Delivery:</strong>
            {' '}
            <u>{DELIVERY_METHODS.find((method) => method.id === delMethod)?.title}</u>
          </Col>
          <Col>
            <strong>Address:</strong>
            {' '}
            <u>{`${city}, ${branch}, ${address}`}</u>
          </Col>
        </Row>
        <ListGroup>
          {value && value.length > 0 ? value.map((item, index) => (
            <ListGroup.Item className="text-start" key={item.id}>{`${index + 1}.${item.author}, ${item.title} ${itemsAmountById[item.id] > 1 ? (`(${itemsAmountById[item.id]} items)`) : ''} `}</ListGroup.Item>
          )) : <ListGroup.Item>No Data...</ListGroup.Item>}
        </ListGroup>
      </td>
    </tr>
  );
}

OrderMoreInfoLine.defaultProps = {
};

OrderMoreInfoLine.propTypes = {
  items: PropTypes.string.isRequired,
  delMethod: PropTypes.number.isRequired,
  city: PropTypes.string.isRequired,
  branch: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
};

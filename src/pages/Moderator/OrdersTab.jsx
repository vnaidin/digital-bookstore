/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
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
              {/* <th>Tel</th> */}
              <th>Price</th>
              {/* <th>Comments</th> */}
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
        {/*  <td>{order.phoneNumber}</td> */}
        <td>{order.price}</td>
        {/* <td>{order.comments}</td> */}
        <td>{ORDER_STATUSES[order.status]}</td>
        <td className="d-flex gap-1">
          <Button variant="warning" onClick={() => { handleOrderUpdate(order.id); }}>Update</Button>
        </td>
      </tr>
      {showMoreInfo && (
      <OrderMoreInfoLine
        items={order.order_items}
        address={order.order_address}
        phoneNumber={order.phoneNumber}
        comments={order.comments}
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
    order_address: PropTypes.shape({
      delMethodId: PropTypes.number,
      city: PropTypes.string,
      street: PropTypes.string,
      houseNr: PropTypes.number,
      flatNr: PropTypes.number,
      branch: PropTypes.number,
    }),
    comments: PropTypes.string,
    price: PropTypes.number,
    status: PropTypes.number,
    order_items: PropTypes.arrayOf(PropTypes.shape({
      itemId: PropTypes.number,
      price: PropTypes.number,
    })),
  }).isRequired,
  handleOrderUpdate: PropTypes.func.isRequired,
};

function OrderMoreInfoLine({
  items, address, phoneNumber, comments,
}) {
  const itemsAmountById = items.map(({ itemId }) => itemId).reduce((prev, cur) => {
    // eslint-disable-next-line no-param-reassign
    prev[cur] = (prev[cur] || 0) + 1;
    return prev;
  }, {});
  const [orderItemsToShow, setOrderItemsToShow] = useState([]);
  useEffect(() => {
    Promise.all(Object.entries(itemsAmountById).map(([id, amount]) => fetch(`${process.env.REACT_APP_BE_URL}/book/${id}`).then(
      (response) => response.json(),
    ).then((xx) => ({ ...xx, amount })))).then((result) => setOrderItemsToShow(result));
  }, [items]);
  const currentDeliveryMethod = DELIVERY_METHODS.find(
    (method) => method.id === address.delMethodId,
  );
  return (
    <tr>
      <td>{' '}</td>
      <td colSpan={5}>

        <Row className="my-3 gap-1">
          <Col>
            <strong>Delivery:</strong>
            {' '}
            <u>{currentDeliveryMethod?.title}</u>
          </Col>
          <Col>
            <strong>Address:</strong>
            {currentDeliveryMethod.stateFullAddress
              ? <u>{` ${address.city}, ${address.street}, ${address.houseNr}, ${address.flatNr}`}</u>
              : <u>{` ${address.city}, ${address.branch}`}</u>}
          </Col>
          <Col>
            <strong>Tel:</strong>
            {' '}
            <u>{phoneNumber}</u>
          </Col>

        </Row>

        <ListGroup as={Row} className="p-3">
          {orderItemsToShow && orderItemsToShow.length > 0 ? orderItemsToShow.map((item, index) => (
            <ListGroup.Item className="text-start" key={item.id}>{`${index + 1}.${item.author}, ${item.title} ${itemsAmountById[item.id] > 1 ? (`(${itemsAmountById[item.id]} items)`) : ''} `}</ListGroup.Item>
          )) : <ListGroup.Item>No Data...</ListGroup.Item>}
        </ListGroup>
        <Row className="p-3">
          Comments:
          {' '}
          {comments}
        </Row>
      </td>
    </tr>
  );
}

OrderMoreInfoLine.defaultProps = {
};

OrderMoreInfoLine.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    itemId: PropTypes.number,
    price: PropTypes.number,
  })).isRequired,
  address: PropTypes.shape({
    delMethodId: PropTypes.number,
    city: PropTypes.string,
    street: PropTypes.string,
    houseNr: PropTypes.number,
    flatNr: PropTypes.number,
    branch: PropTypes.number,
  }).isRequired,
  phoneNumber: PropTypes.string.isRequired,
  comments: PropTypes.string.isRequired,
};

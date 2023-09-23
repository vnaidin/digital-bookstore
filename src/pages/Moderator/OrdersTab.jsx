/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import {
  Button, Container, Table, Spinner, OverlayTrigger, Tooltip, ListGroup, Row, Col, Form,
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useDebounce, useFetch } from '../../utils/hooks';
import authHeader from '../../services/auth-header';
import { DELIVERY_METHODS, ORDER_STATUSES } from '../../utils/constants';
import UpdateOrderModal from './UpdateOrderModal';

export default function OrdersTab() {
  const [showModal, setShowModal] = useState(false);
  const [currentOrder, updateOrderObject] = useState();

  const handleCloseModal = () => { setShowModal(false); updateOrderObject(null); };
  const handleOpenModal = () => setShowModal(true);

  const [search, updSearch] = useState('');
  const debouncedSearch = useDebounce(search, 600);

  const [filters, setFilters] = useState({ // TODO:
    page: 0,
    status: null,
  });
  const url = new URL(`${process.env.REACT_APP_BE_URL}/api/${debouncedSearch.length > 1 ? 'orders/search' : 'all/orders'}`);
  search.length > 1 && url.searchParams.append('search', debouncedSearch);
  filters.status && url.searchParams.append('status', filters.status);

  const { loading, error, value } = useFetch(
    url,
    { headers: authHeader() },
    [showModal, debouncedSearch, filters],
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
        <Row>
          <Col>
            <Form.Control
              className="colmy-3 px-3"
              size="lg"
              placeholder="Name, Surname or TelNumber"
              onChange={(e) => { updSearch(e.target.value); }}
              title="search"
              autoComplete="off"
            />
          </Col>
          <Col className="d-flex gap-2 align-items-center">
            <Form.Label>Filter</Form.Label>
            <Form.Select
              aria-label="Default select example"
              onChange={(event) => setFilters(
                (prev) => ({ ...prev, status: event.target.value === 'By status:' ? null : event.target.value }),
              )}
            >
              <option value={null}>By status:</option>
              {Object.entries(ORDER_STATUSES).map(
                ([id, { title }]) => <option key={id} value={id}>{title}</option>,
              )}
            </Form.Select>

          </Col>
        </Row>
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

        {value && value.length > 0 ? (
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
                <th>Price</th>
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
        ) : <h4>No Data...</h4>}
      </Container>
    </>
  );
}

export function OrderTableLine({ order, handleOrderUpdate }) {
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
        <td>{ORDER_STATUSES[order.status].title}</td>
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
        receiver={order.receiverName ? `${order.receiverName} ${order.receiverSurname} (${order.receiverPhoneNumber})` : null}
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
    phoneNumber: PropTypes.string,
    receiverName: PropTypes.string,
    receiverSurname: PropTypes.string,
    receiverPhoneNumber: PropTypes.string,
    email: PropTypes.string,
    order_address: PropTypes.shape({
      delMethodId: PropTypes.number,
      city: PropTypes.string,
      street: PropTypes.string,
      houseNr: PropTypes.string,
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
  items, address, phoneNumber, comments, receiver,
}) {
  // console.log(items)
  const itemsAmountById = items.map(({ itemId }) => itemId).reduce((prev, cur) => {
    // eslint-disable-next-line no-param-reassign
    prev[cur] = (prev[cur] || 0) + 1;
    return prev;
  }, {});
  const [orderItemsToShow, setOrderItemsToShow] = useState([]);
  useEffect(() => {
    Promise.all(Object.entries(itemsAmountById).map(([id, amount]) => fetch(`${process.env.REACT_APP_BE_URL}/api/item/${id}`).then(
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
        {receiver && (
        <Row className="p-3">
          Receiver:
          {' '}
          {receiver}
        </Row>
        )}

        <ListGroup as={Row} className="p-3">
          {orderItemsToShow && orderItemsToShow.length > 0 ? orderItemsToShow.map((item, index) => (
            <ListGroup.Item className="text-start" key={item.id}>{`${index + 1}.${item.author}, ${item.title} ${itemsAmountById[item.id] > 1 ? (`(${itemsAmountById[item.id]} items)`) : ''} `}</ListGroup.Item>
          )) : <ListGroup.Item>No Data...</ListGroup.Item>}
        </ListGroup>
        {comments && (
        <Row className="p-3">
          Comments:
          {' '}
          {comments}
        </Row>
        )}
      </td>
    </tr>
  );
}

OrderMoreInfoLine.defaultProps = {
  comments: null,
  receiver: null,
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
    houseNr: PropTypes.string,
    flatNr: PropTypes.number,
    branch: PropTypes.number,
  }).isRequired,
  phoneNumber: PropTypes.string.isRequired,
  comments: PropTypes.string,
  receiver: PropTypes.string,
};

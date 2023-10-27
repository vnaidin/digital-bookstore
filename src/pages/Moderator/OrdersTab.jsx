/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from 'react';
import {
  Button, Container, Table, OverlayTrigger, Tooltip, ListGroup, Row, Col, Form,
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useDebounce, useFetch } from '../../utils/hooks';
import authHeader from '../../services/auth-header';
import { DELIVERY_METHODS, ORDER_STATUSES } from '../../utils/constants';
import UpdateOrderModal from './UpdateOrderModal';
import { LoadingComponent, NoDataComponent } from '../../components';
import { orderType } from '../../utils/types';
import PromoCodeService from '../../services/promocode';
import AppContext from '../../appContext';

export default function OrdersTab() {
  const { t } = useTranslation();
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
  // eslint-disable-next-line no-unused-expressions
  search.length > 1 && url.searchParams.append('search', debouncedSearch);
  // eslint-disable-next-line no-unused-expressions
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
              className="col my-1 px-3"
              size="lg"
              placeholder="Name, Surname or TelNumber"
              onChange={(e) => { updSearch(e.target.value); }}
              title="search"
              autoComplete="off"
            />
          </Col>

          <Col className="d-flex gap-2 align-items-center">
            <Form.Label>{t('pages.moderator.tabs.order.filter')}</Form.Label>
            <Form.Select
              aria-label="Default select example"
              onChange={(event) => setFilters(
                (prev) => ({
                  ...prev,
                  status: Number.isNaN(Number(event.target.value)) ? null : event.target.value,
                }),
              )}
            >
              <option value={null}>
                {t('pages.moderator.tabs.order.filter-p')}
                :
              </option>
              {Object.entries(ORDER_STATUSES).map(
                ([id]) => <option key={id} value={id}>{t(`constants.orderStatus.${id}`)}</option>,
              )}
            </Form.Select>

          </Col>
          {/** FIXME: think about pre-defined ranges, today- 1,2 weeks/ months/ */}
          {/* <Col>
            <Form.Label>from today to date:</Form.Label>
            <Form.Control type="date" />
          </Col> */}

        </Row>
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

        {value && value.length > 0 ? (
          <Table
            /* striped */
            bordered
            hover
            responsive
            size="sm"
          >
            <thead>
              <tr>
                {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                <th />
                <th>#</th>
                <th>{t('pages.moderator.tabs.order.table.name')}</th>
                <th>{t('pages.moderator.tabs.order.table.surname')}</th>
                <th>{t('pages.moderator.tabs.order.table.email')}</th>
                <th>{t('pages.moderator.tabs.order.table.price')}</th>
                <th>{t('pages.moderator.tabs.order.table.status')}</th>
                <th>{t('pages.moderator.tabs.order.table.hasPaid')}</th>
                <th>{t('pages.moderator.tabs.order.table.created')}</th>
                <th>{t('pages.moderator.tabs.order.table.actions')}</th>
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
        ) : <NoDataComponent />}
      </Container>
    </>
  );
}

export function OrderTableLine({ order, handleOrderUpdate }) {
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const { t } = useTranslation();
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
        <td>{t(`constants.orderStatus.${order.status}`)}</td>
        <td>{Boolean(order.hasPaid).toString()}</td>
        <td>{new Date(order.createdAt).toLocaleString()}</td>
        <td className="d-flex gap-1">
          <Button variant="warning" onClick={() => { handleOrderUpdate(order.id); }}>{t('pages.moderator.tabs.order.modal.update')}</Button>
        </td>
      </tr>
      {showMoreInfo && (
      <OrderMoreInfoLine
        items={order.order_items}
        address={order.order_address}
        phoneNumber={order.phoneNumber}
        comments={order.comments}
        promocode={order.promocode}
        receiver={order.receiverName ? `${order.receiverName} ${order.receiverSurname} (${order.receiverPhoneNumber})` : null}
      />
      )}
    </>
  );
}
OrderTableLine.defaultProps = {
};

OrderTableLine.propTypes = {
  order: orderType.isRequired,
  handleOrderUpdate: PropTypes.func.isRequired,
};

function OrderMoreInfoLine({
  items, address, phoneNumber, comments, receiver, promocode,
}) {
  const { t } = useTranslation();
  const { dispatch } = useContext(AppContext);
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
      <td colSpan={8}>

        <Row className="my-3 gap-1">
          <Col>
            <strong>
              {t('pages.moderator.tabs.order.table.more-info-line.delivery')}
              :
            </strong>
            {' '}
            <u>{currentDeliveryMethod?.title}</u>
          </Col>
          <Col>
            <strong>
              {t('pages.moderator.tabs.order.table.more-info-line.address')}
              :
            </strong>
            {currentDeliveryMethod.stateFullAddress
              ? <u>{` ${address.city}, ${address.street}, ${address.houseNr}, ${address.flatNr}`}</u>
              : <u>{` ${address.city}, ${address.branch}`}</u>}
          </Col>
          <Col>
            <strong>
              {t('pages.moderator.tabs.order.table.more-info-line.tel')}
              :
            </strong>
            {' '}
            <a
              href={`tel:${phoneNumber}`}
              rel="nofollow"
            >
              {phoneNumber}
            </a>
          </Col>

        </Row>
        {receiver && (
        <Row className="p-3">
          {t('pages.moderator.tabs.order.table.more-info-line.receiver')}
          :
          {' '}
          {receiver}
        </Row>
        )}

        <ListGroup as={Row} className="p-3">
          {orderItemsToShow && orderItemsToShow.length > 0 ? orderItemsToShow.map((item, index) => (
            <ListGroup.Item className="text-start" key={item.id}>{`${index + 1}.${item.author}, ${item.title} ${itemsAmountById[item.id] > 1 ? (`(${itemsAmountById[item.id]} items)`) : ''} `}</ListGroup.Item>
          )) : <ListGroup.Item><NoDataComponent /></ListGroup.Item>}
        </ListGroup>
        {comments && (
        <Row className="p-3">
          {t('pages.moderator.tabs.order.table.more-info-line.comments')}
          :
          {' '}
          {comments}
        </Row>
        )}
        {promocode && (
        <Row className="p-3">
          <Col>
            Promocode
            :
            {' '}
            {promocode}
          </Col>
          <Col>
            <Button
              variant="danger"
              onClick={() => {
                PromoCodeService.deletePromo(promocode).then((response) => {
                  dispatch({ type: 'setToast', payload: { body: response.data.message, callee: t('toasts.callee-sys') } });
                }).catch((promoDelError) => console.error(new Error(promoDelError).message));
              }}
            >
              Delete
            </Button>
          </Col>
        </Row>
        )}
      </td>
    </tr>
  );
}

OrderMoreInfoLine.defaultProps = {
  comments: null,
  receiver: null,
  promocode: null,
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
  promocode: PropTypes.string,
  receiver: PropTypes.string,
};

import React, { useContext, useEffect, useState } from 'react';
import {
  Button, ListGroup, Table, Row, Form, Col, InputGroup, Image,
} from 'react-bootstrap';
import * as formik from 'formik';
import * as yup from 'yup';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import AuthService from '../../../services/auth';
import AppContext from '../../../appContext';
import UserService from '../../../services/user';
import { useFetch } from '../../../utils/hooks';
import authHeader from '../../../services/auth-header';
import { LoadingComponent, NoDataComponent, WishListButton } from '../../../components';
import { post_to_url } from '../../../utils/axios';
import { toBinary } from '../../../utils/helpers';

export default function UserPanel() {
  const { REACT_APP_LIQ_PAY_PUBLIC, REACT_APP_LIQ_PAY_PRIVATE, REACT_APP_BE_URL } = process.env;

  const { state, dispatch } = useContext(AppContext);
  const { t } = useTranslation();
  const { loading, error, value } = useFetch(
    `${REACT_APP_BE_URL}/api/all/orders/${state?.currentUser?.id}`,
    { headers: authHeader() },
    [],
  );
  const logout = () => {
    AuthService.logout();
    dispatch({ type: 'logOut' });
  };
  const { Formik } = formik;

  const schema = yup.object().shape({
    name: yup.string().required(),
    surname: yup.string().required(),
    phoneNumber: yup.number().required(),
  });

  const handleUpdateUserInfoSubmit = (values) => {
    UserService.editUser(state.currentUser.id, values).then((response) => {
      dispatch({ type: 'setToast', payload: { body: response.data.message, callee: t('toasts.callee-sys') } });
      // replace info locally
      dispatch({ type: 'logIn', payload: { ...state.currentUser, ...values } });
      localStorage.setItem('user', JSON.stringify({ ...state.currentUser, ...values }));
    }).catch((err) => console.error(new Error(err)));
  };
  return (
    <>
      <Row className="my-3">
        <h3 className="text-center">{t('layout.headerBottom.auth.user-info')}</h3>
        <Formik
          validationSchema={schema}
          onSubmit={handleUpdateUserInfoSubmit}
          initialValues={{
            name: state?.currentUser?.name || '',
            surname: state?.currentUser?.surname || '',
            phoneNumber: state?.currentUser?.phoneNumber || '',
          }}
        >
          {({
            handleSubmit, handleChange, values, touched, errors,
          }) => (
            <Form noValidate onSubmit={handleSubmit}>
              <Row className="mb-3">
                <Form.Group
                  as={Col}
                  md="6"
                  controlId="validationFormik010"
                  className="position-relative"
                >
                  <Form.Label>{t('layout.headerBottom.auth.form.name')}</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    isValid={touched.name && !errors.name}
                  />
                  <Form.Control.Feedback tooltip>{t('layout.headerBottom.auth.form.valid-feedback')}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group
                  as={Col}
                  md="6"
                  controlId="validationFormik1020"
                  className="position-relative"
                >
                  <Form.Label>{t('layout.headerBottom.auth.form.surname')}</Form.Label>
                  <Form.Control
                    type="text"
                    name="surname"
                    value={values.surname}
                    onChange={handleChange}
                    isValid={touched.surname && !errors.surname}
                  />

                  <Form.Control.Feedback tooltip>{t('layout.headerBottom.auth.form.valid-feedback')}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} sm="12" controlId="validationFormikUsername200">
                  <Form.Label>{t('layout.headerBottom.auth.form.tel')}</Form.Label>
                  <InputGroup hasValidation>
                    <Form.Control
                      type="phoneNumber"
                      placeholder="095 123 45 67"
                      width={100}
                      aria-describedby="inputGroupPrepend"
                      name="phoneNumber"
                      value={values.phoneNumber}
                      onChange={handleChange}
                      isInvalid={!!errors.phoneNumber}
                    />
                    <Form.Control.Feedback type="invalid" tooltip>
                      {errors.phoneNumber}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
              </Row>
              <Button
                type="submit"
                className="button"
                style={{ fontWeight: '900' }}
              >
                {t('layout.headerBottom.auth.save')}
              </Button>
            </Form>
          )}
        </Formik>
      </Row>

      {/* <Row className="my-3">

        <h3 className="text-center">Roles</h3>
        <ListGroup>
          {state?.currentUser?.roles.map((role) => (
            <ListGroup.Item
              key={role}
            >
              {role}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Row> */}

      <Row className="my-3">
        {value && <h3 className="text-center">{t('layout.headerBottom.auth.ordersTable.title')}</h3>}
        {error && (
        <p>
          {new Error(error).message}
        </p>
        )}
        {loading && (
        <LoadingComponent />
        )}
        {value && value.length > 0 ? (
          <Table
            /* striped */
            bordered
            hover
            responsive
          >
            <thead>
              <tr>
                <th>#</th>
                <th>{t('layout.headerBottom.auth.ordersTable.items')}</th>
                <th>{t('layout.headerBottom.auth.ordersTable.price')}</th>
                <th>{t('layout.headerBottom.auth.ordersTable.status')}</th>
                <th>{t('layout.headerBottom.auth.ordersTable.hasPaid')}</th>
              </tr>
            </thead>
            <tbody>
              {value.map((order, ind) => (
                <tr key={order.id}>
                  <td>{ind + 1}</td>
                  <OrderItemsCell items={order.order_items} />
                  <td>{order.price}</td>
                  <td>{t(`constants.orderStatus.${order.status}`)}</td>
                  <td>
                    {/* eslint-disable-next-line no-nested-ternary */}
                    {Number(order.paymentMethodId) === 1 && order.status <= 1 ? order.hasPaid != null ? <p>{t('pages.orderPage.table.hasPaid-yes')}</p> : (
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
                    ) : <p>-</p>}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : <NoDataComponent />}
      </Row>

      <Row className="my-3">
        <WishListComponent />
      </Row>

      <Button variant="danger" onClick={logout}>{t('layout.headerBottom.auth.logout')}</Button>
    </>
  );
}

export function OrderItemsCell({ items }) {
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

  return (
    <td>
      <ListGroup>
        {orderItemsToShow && orderItemsToShow.length > 0 && orderItemsToShow.map((item) => (
          <ListGroup.Item className="text-start" key={item.id}>
            <Image src={`${process.env.REACT_APP_BE_URL}/${item.image}`} width={30} rounded className="m-1" />
            {`${item.title} `}
            {itemsAmountById[item.id] > 1 ? (`(${itemsAmountById[item.id]})`) : ''}
          </ListGroup.Item>
        )) }
      </ListGroup>
    </td>
  );
}

OrderItemsCell.defaultProps = {
  items: [],
};

OrderItemsCell.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  })),
};

export function WishListComponent() {
  const { t } = useTranslation();
  const { state } = useContext(AppContext);
  return (
    <>
      {state?.wishList && <h3 className="text-center">{t('layout.headerBottom.auth.wishlist.title')}</h3>}
      {state?.wishList && state?.wishList.length > 0 ? (
        <ListGroup>
          {state.wishList.map(({
            id,
            price,
            title,
            image,
            reducedPrice,
            isReducedNow,
          }) => (
            <ListGroup.Item key={id}>
              <Row className="gap-1 align-items-center">

                <Col
                  xs={3}
                >
                  <Image
                    src={`${process.env.REACT_APP_BE_URL}/${image}`}
                    width={50}
                    rounded
                    className="m-1"
                  />
                </Col>
                <p
                  className="m-0 p-0 col"
                  style={{
                    width: '200px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
                  }}
                >
                  {title}
                </p>

                <WishListButton
                  id={id}
                  price={price}
                  title={title}
                  image={image}
                  reducedPrice={reducedPrice}
                  isReducedNow={isReducedNow}
                />
              </Row>

            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : <NoDataComponent />}
    </>
  );
}

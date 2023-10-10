import React, { useContext, useEffect, useState } from 'react';
import {
  Button, ListGroup, Table, Row, Form, Col, InputGroup, Spinner, Image,
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
import { NoDataComponent } from '../../../components';

export default function UserPanel() {
  const { state, dispatch } = useContext(AppContext);
  const { t } = useTranslation();
  const { loading, error, value } = useFetch(
    `${process.env.REACT_APP_BE_URL}/api/all/orders/${state?.currentUser?.id}`,
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
        <h3 className="text-center">{t('layout.headerBottom.auth.ordersTable.title')}</h3>
        {error && (
        <p>
          {new Error(error).message}
        </p>
        )}
        {loading && (
        <Spinner animation="border" />
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
              </tr>
            </thead>
            <tbody>
              {value.map((order, ind) => (
                <tr key={order.id}>
                  <td>{ind + 1}</td>
                  <OrderItemsCell items={order.order_items} />
                  <td>{order.price}</td>
                  <td>{t(`constants.orderStatus.${order.status}`)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : <NoDataComponent />}
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
    Promise.all(Object.entries(itemsAmountById).map(([id, amount]) => fetch(`${process.env.REACT_APP_BE_URL}/api/book/${id}`).then(
      (response) => response.json(),
    ).then((xx) => ({ ...xx, amount })))).then((result) => setOrderItemsToShow(result));
  }, [items]);

  return (
    <td>
      <ListGroup>
        {orderItemsToShow && orderItemsToShow.length > 0 && orderItemsToShow.map((item) => (
          <ListGroup.Item className="text-start" key={item.id}>
            <Image src={item.image} width={30} rounded className="m-1" />
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

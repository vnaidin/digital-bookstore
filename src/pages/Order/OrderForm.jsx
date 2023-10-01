/* eslint-disable */
import crypto from 'crypto';
import React, { useContext, useState } from 'react';
import {
  Row, Col, Button, Form, InputGroup,
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { DELIVERY_METHODS, PAYMENT_METHODS } from '../../utils/constants';
import AppContext from '../../appContext';
import OrderService from '../../services/order';
import { telegramBotSendMsg } from '../../utils/axios';

function ToBinary(str) {
  let result = '';

  str = encodeURIComponent(str);

  for (let i = 0; i < str.length; i++) {
    if (str[i] == '%') {
      result += String.fromCharCode(parseInt(str.substring(i + 1, i + 3), 16));
      i += 2;
    } else result += str[i];
  }

  return result;
}

function post_to_url(path, params, method) {
  method = method || 'post';

  const form = document.createElement('form');

  // Move the submit function to another variable
  // so that it doesn't get overwritten.
  form._submit_function_ = form.submit;

  form.setAttribute('method', method);
  form.setAttribute('action', path);
  // form.setAttribute('target', '_blank');

  for (const key in params) {
    const hiddenField = document.createElement('input');
    hiddenField.setAttribute('type', 'hidden');
    hiddenField.setAttribute('name', key);
    hiddenField.setAttribute('value', params[key]);

    form.appendChild(hiddenField);
  }

  document.body.appendChild(form);
  form._submit_function_(); // Call the renamed function.
}

export default function OrderForm({ totalPrice }) {
  const [deliveryMethod, setDeliveryMethod] = useState();
  const [addReceiver, setReceiver] = useState(false);
  const { dispatch, state } = useContext(AppContext);
  const [formData, setFormData] = useState({
    name: state.currentUser?.name,
    surname: state.currentUser?.surname,
    email: state.currentUser?.email,
    phoneNumber: state.currentUser?.phoneNumber,
  });
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const handleChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const { REACT_APP_LIQ_PAY_PUBLIC, REACT_APP_LIQ_PAY_PRIVATE } = process.env;

  // console.log('signature', signature);

  const handleSubmit = (values) => {
    const objectToPost = {
      // ...values,
      name: values.name,
      surname: values.surname,
      phoneNumber: values.phoneNumber,
      email: values.email,
      userId: state?.currentUser?.id,
      receiverName: values.receiverName,
      receiverSurname: values.receiverSurname,
      receiverPhoneNumber: values.receiverPhoneNumber,
      order_items: state.shoppingCart.map(({
        id, price, reducedPrice, isReducedNow,
      }) => ({ itemId: id, price: isReducedNow ? reducedPrice : price })),
      order_address: {
        delMethodId: +values.delMethod,
        city: values.city,
        street: values.street,
        houseNr: values.houseNr,
        flatNr: +values.flatNr,
        branch: +values.branch,
      },
      price: totalPrice,
      status: false,
      comments: values.comments,
      paymentMethodId: +values.paymentMethodId,
    };

    //  console.log('object to post', objectToPost);
    OrderService.createOrder(objectToPost).then(
      (response) => {
        localStorage.setItem('cart', JSON.stringify([]));
        dispatch({
          type: 'setToast',
          payload: { body: response.data.message, callee: t('toasts.callee-sys') },
        });
        if (values.paymentMethodId === 1) {
          // console.log('liqpay');
          const json_string = {
            public_key: REACT_APP_LIQ_PAY_PUBLIC,
            version: '3',
            action: 'pay',
            amount: 1, // totalPrice,
            currency: 'UAH',
            description: 'Оплата за книги',
            result_url: window.location.origin,
            server_url: `${window.location.origin}/api/order/payment-update`,
            language: 'uk',
            order_id: String(response.data.id),
          };
          const liqpayData = btoa(ToBinary(JSON.stringify(json_string)));
          // console.log('liqpayData', liqpayData);

          const sign_string = REACT_APP_LIQ_PAY_PRIVATE + liqpayData + REACT_APP_LIQ_PAY_PRIVATE;
          const sha1 = crypto.createHash('sha1');
          sha1.update(sign_string);

          const signature = sha1.digest('base64');
          post_to_url('https://www.liqpay.ua/api/3/checkout', { submit: 'submit', data: liqpayData, signature });
        } else {
          setTimeout(() => {
            dispatch({ type: 'addItemToCart', payload: [] });
            navigate('/');
          }, 3000);
        }
        return response.data.id;
      },
    ).then((id) => {
      const hypertext = `
      New Order!
      From: ${values.name} ${values.surname}
      Price: ${totalPrice} UAH`;
      telegramBotSendMsg(hypertext, `${process.env.REACT_APP_BE_URL}/order/${id}`);
    }).catch((e) => console.error(new Error(e)));
  };
  return (
    <Form onSubmit={(event) => {
      event.preventDefault();
      handleSubmit(formData);
    }}
    >
      <Row className="mb-3">
        <h2 className="text-start my-1">
          1.
          {' '}
          {t('pages.order.form.personal-info')}
        </h2>
        <Form.Group
          as={Col}
          md="6"
          controlId="validationFormik0131"
          className="position-relative"
        >
          <Form.Label>{t('pages.order.form.name')}</Form.Label>
          <InputGroup>
            <Form.Control
              type="text"
              title="name"
              placeholder={t('pages.order.form.name-p')}
              defaultValue={formData?.name}
              onChange={(event) => handleChange(event.target.title, event.target.value)}
              readOnly={state.currentUser?.name}
              autoComplete="given-name"
              required
            />
          </InputGroup>

        </Form.Group>
        <Form.Group
          as={Col}
          md="6"
          controlId="validationFormik102"
          className="position-relative"
        >
          <Form.Label>{t('pages.order.form.surname')}</Form.Label>
          <InputGroup>
            <Form.Control
              type="text"
              title="surname"
              placeholder={t('pages.order.form.surname-p')}
              defaultValue={formData?.surname}
              onChange={(event) => handleChange(event.target.title, event.target.value)}
              readOnly={state.currentUser?.surname}
              autoComplete="family-name"
              required
            />
          </InputGroup>
        </Form.Group>

        <Form.Group as={Col} sm="12" controlId="validationFormikUsername2">
          <Form.Label>{t('pages.order.form.tel')}</Form.Label>
          <InputGroup>
            <Form.Control
              type="tel"
              placeholder="+38095 123 45 67"
              width={100}
              aria-describedby="inputGroupPrepend"
              title="phoneNumber"
              defaultValue={formData?.phoneNumber}
              onChange={(event) => handleChange(event.target.title, event.target.value)}
              readOnly={state.currentUser?.phoneNumber}
              autoComplete="tel"
              required
            />
          </InputGroup>
        </Form.Group>

        <Form.Group as={Col} sm="12" controlId="validationFormikEmail2">
          <Form.Label>{t('pages.order.form.email')}</Form.Label>
          <InputGroup>
            <Form.Control
              type="email"
              placeholder={t('pages.order.form.email-p')}
              width={100}
              aria-describedby="inputGroupPrepend"
              title="email"
              defaultValue={formData?.email}
              onChange={(event) => handleChange(event.target.title, event.target.value)}
              readOnly={state.currentUser?.id > 0}
              autoComplete="email"
              required
            />
          </InputGroup>
        </Form.Group>

        <Form.Group>
          <Form.Label>{t('pages.order.form.receiver')}</Form.Label>
          <div
            className="d-flex my-0 gap-1 justify-content-center"
          >
            <Form.Check
              type="radio"
              label={t('pages.order.form.receive-me')}
              value={0}
              checked={!addReceiver}
              onChange={() => setReceiver(false)}
            />
            <Form.Check
              type="radio"
              label={t('pages.order.form.receive-not-me')}
              value={1}
              checked={addReceiver}
              onChange={() => setReceiver(true)}
            />
          </div>
        </Form.Group>
        {addReceiver && (
          <>
            <Form.Group
              as={Col}
              md="6"
              controlId="validationFormik0131"
              className="position-relative"
            >
              <Form.Label>{t('pages.order.form.name')}</Form.Label>
              <InputGroup>
                <Form.Control
                  type="text"
                  title="receiverName"
                  placeholder={t('pages.order.form.name-p')}
                  defaultValue={formData?.receiverName}
                  onChange={(event) => handleChange(event.target.title, event.target.value)}
                />
              </InputGroup>

            </Form.Group>
            <Form.Group
              as={Col}
              md="6"
              controlId="validationFormik102"
              className="position-relative"
            >
              <Form.Label>{t('pages.order.form.surname')}</Form.Label>
              <InputGroup>
                <Form.Control
                  type="text"
                  title="receiverSurname"
                  placeholder={t('pages.order.form.surname')}
                  defaultValue={formData?.receiverSurname}
                  onChange={(event) => handleChange(event.target.title, event.target.value)}
                />
              </InputGroup>
            </Form.Group>

            <Form.Group as={Col} sm="12" controlId="validationFormikUsername2">
              <Form.Label>{t('pages.order.form.tel')}</Form.Label>
              <InputGroup>
                <Form.Control
                  type="tel"
                  placeholder="+38095 123 45 67"
                  width={100}
                  aria-describedby="inputGroupPrepend"
                  title="receiverPhoneNumber"
                  defaultValue={formData?.receiverPhoneNumber}
                  onChange={(event) => handleChange(event.target.title, event.target.value)}
                />
              </InputGroup>
            </Form.Group>
          </>
        )}

        <hr className="my-3" />
        <h2 className="text-start my-1">
          2.
          {' '}
          {t('pages.order.form.delivery')}
        </h2>
        <u className="text-start">
          {t('pages.order.form.del-free-from-1')}
          {` ${DELIVERY_METHODS[0].freeFrom} ${i18n.language === 'en' ? ' UAH' : ' грн'} `}
          {' '}
          {t('pages.order.form.del-free-from-2')}
        </u>

        <Form.Group as={Col} sm="12" controlId="delMethod">
          <Form.Label>{t('pages.order.form.del-method')}</Form.Label>
          <InputGroup>
            <Form.Select
              aria-label="collection-select"
              onChange={(event) => {
                handleChange(event.target.title, event.target.value);
                dispatch({ type: 'setDeliveryMethod', payload: DELIVERY_METHODS.find((method) => method.id === +event.target.value) });
                setDeliveryMethod(
                  DELIVERY_METHODS.find((method) => method.id === +event.target.value),
                );
              }}
              title="delMethod"
             // placeholder="Category"
              required
            >
              <option hidden value={null}>{t('pages.order.form.choose-del-method')}</option>
              {DELIVERY_METHODS.map(
                ({
                  id, title,
                }) => (
                  <option
                    key={title}
                    value={+id}
                  >
                    {t(`pages.delivery.methods.${id}`)}
                  </option>
                ),
              )}
            </Form.Select>

          </InputGroup>
        </Form.Group>

      </Row>
      <Row className="mb-3">

        {deliveryMethod?.stateFullAddress ? (
          <Row>
            <Form.Group
              as={Col}
              md="12"
              controlId="validationFormik103"
              className="position-relative"
            >
              <Form.Label>{t('pages.order.form.city')}</Form.Label>
              <Form.Control
                type="text"
                placeholder={t('pages.order.form.city-p')}
                title="city"
                defaultValue={formData?.city}
                onChange={(event) => handleChange(event.target.title, event.target.value)}
                required
              />

            </Form.Group>
            <Form.Group
              as={Col}
              md="6"
              controlId="validationFormik104"
              className="position-relative"
            >
              <Form.Label>{t('pages.order.form.street')}</Form.Label>
              <Form.Control
                type="text"
                placeholder={t('pages.order.form.street-p')}
                title="street"
                defaultValue={formData?.street}
                onChange={(event) => handleChange(event.target.title, event.target.value)}
              />
            </Form.Group>
            <Form.Group
              as={Col}
              md="3"
              controlId="validationFormik105"
              className="position-relative"
            >
              <Form.Label>{t('pages.order.form.house-nr')}</Form.Label>
              <Form.Control
                type="number"
                placeholder={t('pages.order.form.house-nr')}
                title="houseNr"
                defaultValue={formData?.houseNr}
                onChange={(event) => handleChange(event.target.title, event.target.value)}
              />

            </Form.Group>
            <Form.Group
              as={Col}
              md="3"
              controlId="validationFormik1051"
              className="position-relative"
            >
              <Form.Label>{t('pages.order.form.flat-nr')}</Form.Label>
              <Form.Control
                type="number"
                placeholder={t('pages.order.form.flat-nr')}
                title="flatNr"
                defaultValue={formData?.flatNr}
                onChange={(event) => handleChange(event.target.title, event.target.value)}
              />
            </Form.Group>
          </Row>
        ) : (
          <>
            <Form.Group
              as={Col}
              md="5"
              controlId="validationFormik50"
              className="position-relative"
            >
              <Form.Label>{t('pages.order.form.city')}</Form.Label>
              <Form.Control
                type="text"
                placeholder={t('pages.order.form.city-p')}
                title="city"
                defaultValue={formData?.city}
                onChange={(event) => handleChange(event.target.title, event.target.value)}
                required
              />

            </Form.Group>
            <Form.Group
              as={Col}
              md="5"
              controlId="validationFormik151"
              className="position-relative"
            >
              <Form.Label>{t('pages.order.form.branch')}</Form.Label>
              <Form.Control
                type="number"
                placeholder={t('pages.order.form.branch')}
                title="branch"
                defaultValue={formData?.branch}
                onChange={(event) => handleChange(event.target.title, event.target.value)}
              />
            </Form.Group>
          </>
        )}
        <hr className="my-3" />

        <h2 className="text-start my-1">
          3.
          {' '}
          {t('pages.order.form.payment-method')}
        </h2>
        <Form.Group
          as={Col}
          sm="12"
          controlId="validationFormik10611"
          className="position-relative"
        >
          <InputGroup>
            <Form.Group
              as={Col}
              md="5"
              controlId="validationFormik15134"
              className="position-relative"
              required
            >
              {PAYMENT_METHODS.map((payMethod, ind) => (
                <Form.Check
                  required
                  key={payMethod}
                  type="radio"
                  id={payMethod}
                  label={t(`constants.paymentMethods.${ind}`)}
                  value={+ind}
                  checked={+ind === formData?.paymentMethodId}
                  onChange={(event) => handleChange('paymentMethodId', +event.target.value)}
                  className="text-capitalize"
                />
              ))}
            </Form.Group>
          </InputGroup>
        </Form.Group>

        <Form.Group
          as={Col}
          sm="12"
          controlId="validationFormik106"
          className="position-relative"
        >
          <Form.Label>{t('pages.order.form.comments')}</Form.Label>
          <Form.Control
            as="textarea"
            placeholder={t('pages.order.form.comments')}
            title="comments"
            defaultValue={formData?.comments}
            onChange={(event) => handleChange(event.target.title, event.target.value)}
          />
        </Form.Group>
      </Row>

      <Button
        type="submit"
        style={{ backgroundColor: '#05aac2', fontWeight: '900' }}
      >
        {t('pages.order.form.submit-order')}
      </Button>

      {/* formData && +formData?.paymentMethodId === 1 && (
        <form method="POST" acceptCharset="utf-8" target="_blank" action="https://www.liqpay.ua/api/3/checkout">
          <input
            type="hidden"
            name="data"
            value={liqpayData}
          />
          <input type="hidden" name="signature" value={signature} />
          <Button
            type="submit"
            style={{ backgroundColor: '#05aac2', fontWeight: '900' }}
          >
            Pay
          </Button>
        </form>
      ) */}
    </Form>

  );
}

OrderForm.defaultProps = {
};

OrderForm.propTypes = {
  totalPrice: PropTypes.number.isRequired,
};

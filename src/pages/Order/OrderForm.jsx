import crypto from 'crypto';
import React, { useContext, useEffect, useState } from 'react';
import {
  Row, Col, Button, Form, InputGroup,
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FcApproval } from 'react-icons/fc';
import { DELIVERY_METHODS, PAYMENT_METHODS } from '../../utils/constants';
import AppContext from '../../appContext';
import OrderService from '../../services/order';
import { post_to_url, telegramBotSendMsg } from '../../utils/axios';
import { toBinary } from '../../utils/helpers';
import { useGetPromoCodes } from '../../utils/hooks';
import { promoCodeType } from '../../utils/types';

export default function OrderForm({ totalPrice, updatePriceWithPromocode, currentPromo }) {
  const [deliveryMethod, setDeliveryMethod] = useState();
  const [addReceiver, setReceiver] = useState(false);
  const promocodesArray = useGetPromoCodes();

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

  const { REACT_APP_LIQ_PAY_PUBLIC, REACT_APP_LIQ_PAY_PRIVATE } = import.meta.env;

  useEffect(() => {
    const today = new Date().toUTCString();
    // if we have valid promocode we pass promo object to parent
    // BE has UTC, so converting local datetime to UTC
    if (formData?.promocode && formData?.promocode.length > 0 && promocodesArray.some(
      ({ name, from, till }) => name === formData?.promocode.toUpperCase()
      && Date.parse(from) < Date.parse(today)
       && Date.parse(till) > Date.parse(today),
    )) {
      updatePriceWithPromocode(promocodesArray.find(
        ({ name/* , from, till */ }) => name === formData?.promocode.toUpperCase(),
        /* && new Date(from) > today && new Date(till) < today, */
      ));
    } else {
      updatePriceWithPromocode({});
    }
  }, [formData?.promocode]);

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
      promocode: values.promocode ? String(values.promocode).toUpperCase() : '',
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
            amount: totalPrice,
            currency: 'UAH',
            description: 'Оплата за книги',
            result_url: window.location.origin,
            server_url: `${window.location.origin}/api/order/payment-update`,
            language: 'uk',
            order_id: String(response.data.id),
          };
          const liqpayData = window.btoa(toBinary(JSON.stringify(json_string)));
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
      telegramBotSendMsg(hypertext, `${import.meta.env.REACT_APP_BE_URL}/order/${id}`);
    }).catch((e) => console.error(new Error(e)));
  };
  return (
    <Form
      onSubmit={(event) => {
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
              required={!formData.name}
              isInvalid={!formData.name}
              isValid={formData.name?.length > 0}
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
              required={!formData.surname}
              isInvalid={!formData.surname}
              isValid={formData.surname?.length > 0}
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
              required={!formData.phoneNumber}
              isInvalid={!formData.phoneNumber}
              isValid={formData.phoneNumber?.length > 0}
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
              required={!formData.email}
              isInvalid={!formData.email}
              isValid={formData.email?.length > 0}
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
                  required={addReceiver}
                  isInvalid={!formData.receiverName}
                  isValid={formData.receiverName?.length > 0}
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
                  required={addReceiver}
                  isInvalid={!formData.receiverSurname}
                  isValid={formData.receiverSurname?.length > 0}
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
                  required={addReceiver}
                  isInvalid={!formData.receiverPhoneNumber}
                  isValid={formData.receiverPhoneNumber?.length > 0}
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
              isInvalid={!deliveryMethod}
              isValid={deliveryMethod}
            >
              <option value="">{t('pages.order.form.choose-del-method')}</option>
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
                isInvalid={!formData.city}
                isValid={formData.city?.length > 0}
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
                required={deliveryMethod?.stateFullAddress}
                isInvalid={!formData.street}
                isValid={formData.street?.length > 0}
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
                type="text"
                placeholder={t('pages.order.form.house-nr')}
                title="houseNr"
                defaultValue={formData?.houseNr}
                onChange={(event) => handleChange(event.target.title, event.target.value)}
                required={deliveryMethod?.stateFullAddress}
                isInvalid={!formData.houseNr}
                isValid={formData.houseNr?.length > 0}
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
                required={deliveryMethod?.stateFullAddress}
                isInvalid={!formData.flatNr}
                isValid={formData.flatNr}
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
                isInvalid={!formData.city}
                isValid={formData.city?.length > 0}
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
                required
                autoComplete="off"
                isInvalid={!formData.branch}
                isValid={formData.branch}
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
            >
              {PAYMENT_METHODS.map((payMethod, ind) => (
                <Form.Check
                  name="grouped"
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

        <hr className="my-3" />

        <h2 className="text-start my-1">
          4.
          {' '}
          {t('pages.order.form.promocode')}
        </h2>
        <Form.Group
          as={Row}
        >
          <Form.Group
            as={Col}
            sm="6"
            controlId="validationFormik106"
            className="position-relative"
          >
            <Form.Label>
              {t('pages.order.form.enter-promo')}
            </Form.Label>

          </Form.Group>
          <Form.Group
            as={Col}
            sm="6"
            controlId="validationFormik106"
            className="position-relative"
          >
            <InputGroup className="mb-3">

              <Form.Control
                type="text"
                placeholder={t('pages.order.form.promocode-p')}
                title="promocode"
                // defaultValue={formData?.comments}
                onChange={(event) => handleChange(event.target.title, event.target.value)}
                autoComplete="off"
              />
              {currentPromo?.id && <InputGroup.Text className="p-1" id="basic-addon1"><FcApproval size={20} /></InputGroup.Text>}
            </InputGroup>
          </Form.Group>

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
        className="button"
        style={{ fontWeight: '900' }}
      >
        {t('pages.order.form.submit-order')}
      </Button>
    </Form>

  );
}

OrderForm.defaultProps = {
  currentPromo: undefined,
};

OrderForm.propTypes = {
  totalPrice: PropTypes.number.isRequired,
  updatePriceWithPromocode: PropTypes.func.isRequired,
  currentPromo: promoCodeType,
};

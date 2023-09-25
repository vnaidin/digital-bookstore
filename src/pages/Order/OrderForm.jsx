import React, { useContext, useState } from 'react';
import {
  Row, Col, Button, Form, InputGroup,
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import * as formik from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { DELIVERY_METHODS, PAYMENT_METHODS } from '../../utils/constants';
import AppContext from '../../appContext';
import OrderService from '../../services/order';
import { telegramBotSendMsg } from '../../utils/axios';

export default function OrderForm({ totalPrice }) {
  const [deliveryMethod, setDeliveryMethod] = useState();
  const [addReceiver, setReceiver] = useState(false);
  const { dispatch, state } = useContext(AppContext);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { Formik } = formik;

  const schema = yup.object().shape({ // TODO: validation to improve
    name: yup.string().required().min(3),
    surname: yup.string().required().min(3),
    phoneNumber: yup.string().required(),
    receiverName: yup.string().min(3),
    receiverSurname: yup.string().min(3),
    receiverPhoneNumber: yup.string(),
    email: yup.string().required().email(),
    city: yup.string().required().min(2),
    street: yup.string()/* .required() */,
    houseNr: yup.string()/* .required() */,
    flatNr: yup.number()/* .required() */,
    branch: yup.number()/* .required() */,
    paymentMethodId: yup.number().required(),
    delMethod: yup.number().required(),
    comments: yup.string()/* .required() */,
  });

  const handleOrderSubmit = (values) => {
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
      order_items: state.shoppingCart.map(({ id, price }) => ({ itemId: id, price })),
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
      paymentMethodId: +values.paymentMethodId,
    };
    //  console.log(objectToPost);
    OrderService.createOrder(objectToPost).then(
      (response) => {
        localStorage.setItem('cart', JSON.stringify([]));
        dispatch({ type: 'setToast', payload: { body: response.data.message, callee: t('toasts.callee-sys') } });
        setTimeout(() => {
          dispatch({ type: 'addItemToCart', payload: [] });
          navigate('/');
        }, 3000);
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
    <Formik
      validationSchema={schema}
      onSubmit={handleOrderSubmit}
      initialValues={{
        name: state?.currentUser?.name || '',
        surname: state?.currentUser?.surname || '',
        phoneNumber: state?.currentUser?.phoneNumber || '',
        email: state?.currentUser?.email || '',
        city: '',
        address: '',
        //  zip: '',
        branch: '',
        comments: '',
      }}
    >
      {({
        handleSubmit, handleChange, values, touched, errors,
      }) => (
        <Form noValidate onSubmit={handleSubmit}>
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
              <InputGroup hasValidation>
                <Form.Control
                  type="text"
                  name="name"
                  placeholder={t('pages.order.form.name-p')}
                  value={values.name}
                  onChange={handleChange}
                  isValid={touched.name && !!errors.name}
                  isInvalid={/* touched.surname &&  */errors.name}
                  readOnly={state.currentUser?.name}
                />
                <Form.Control.Feedback tooltip>{t('layout.headerBottom.auth.form.valid-feedback')}</Form.Control.Feedback>
                <Form.Control.Feedback type="invalid" tooltip>
                  {errors.name}
                </Form.Control.Feedback>
              </InputGroup>

            </Form.Group>
            <Form.Group
              as={Col}
              md="6"
              controlId="validationFormik102"
              className="position-relative"
            >
              <Form.Label>{t('pages.order.form.surname')}</Form.Label>
              <InputGroup hasValidation>
                <Form.Control
                  type="text"
                  name="surname"
                  placeholder={t('pages.order.form.surname-p')}
                  value={values.surname}
                  onChange={handleChange}
                  isValid={touched.surname && !!errors.surname}
                  isInvalid={/* touched.surname &&  */errors.surname}
                  readOnly={state.currentUser?.surname}
                />
                <Form.Control.Feedback tooltip>{t('layout.headerBottom.auth.form.valid-feedback')}</Form.Control.Feedback>
                <Form.Control.Feedback type="invalid" tooltip>
                  {errors.surname}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            <Form.Group as={Col} sm="12" controlId="validationFormikUsername2">
              <Form.Label>{t('pages.order.form.tel')}</Form.Label>
              <InputGroup hasValidation>
                <Form.Control
                  type="tel"
                  placeholder="+38095 123 45 67"
                  width={100}
                  aria-describedby="inputGroupPrepend"
                  name="phoneNumber"
                  value={values.phoneNumber}
                  onChange={handleChange}
                  isInvalid={/* touched.phoneNumber && */ !!errors.phoneNumber}
                  readOnly={state.currentUser?.phoneNumber}
                />
                <Form.Control.Feedback type="invalid" tooltip>
                  {errors.phoneNumber}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            <Form.Group as={Col} sm="12" controlId="validationFormikEmail2">
              <Form.Label>{t('pages.order.form.email')}</Form.Label>
              <InputGroup hasValidation>
                <Form.Control
                  type="email"
                  placeholder={t('pages.order.form.email-p')}
                  width={100}
                  aria-describedby="inputGroupPrepend"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  isInvalid={!!errors.email}
                  readOnly={state.currentUser?.id > 0}
                />
                <Form.Control.Feedback type="invalid" tooltip>
                  {errors.email}
                </Form.Control.Feedback>
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
                  <InputGroup hasValidation>
                    <Form.Control
                      type="text"
                      name="receiverName"
                      placeholder={t('pages.order.form.name-p')}
                      value={values.receiverName}
                      onChange={handleChange}
                      isValid={touched.receiverName && !!errors.receiverName}
                      isInvalid={/* touched.surname &&  */errors.receiverName}
                    />
                    <Form.Control.Feedback tooltip>{t('layout.headerBottom.auth.form.valid-feedback')}</Form.Control.Feedback>
                    <Form.Control.Feedback type="invalid" tooltip>
                      {errors.receiverName}
                    </Form.Control.Feedback>
                  </InputGroup>

                </Form.Group>
                <Form.Group
                  as={Col}
                  md="6"
                  controlId="validationFormik102"
                  className="position-relative"
                >
                  <Form.Label>{t('pages.order.form.surname')}</Form.Label>
                  <InputGroup hasValidation>
                    <Form.Control
                      type="text"
                      name="receiverSurname"
                      placeholder={t('pages.order.form.surname')}
                      value={values.receiverSurname}
                      onChange={handleChange}
                      isValid={touched.receiverSurname && !!errors.receiverSurname}
                      isInvalid={/* touched.receiverSurname &&  */errors.receiverSurname}
                      readOnly={state.currentUser?.receiverSurname}
                    />
                    <Form.Control.Feedback tooltip>{t('layout.headerBottom.auth.form.valid-feedback')}</Form.Control.Feedback>
                    <Form.Control.Feedback type="invalid" tooltip>
                      {errors.receiverSurname}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                <Form.Group as={Col} sm="12" controlId="validationFormikUsername2">
                  <Form.Label>{t('pages.order.form.tel')}</Form.Label>
                  <InputGroup hasValidation>
                    <Form.Control
                      type="tel"
                      placeholder="+38095 123 45 67"
                      width={100}
                      aria-describedby="inputGroupPrepend"
                      name="receiverPhoneNumber"
                      value={values.receiverPhoneNumber}
                      onChange={handleChange}
                      isInvalid={/* touched.receiverPhoneNumber && */ !!errors.receiverPhoneNumber}
                      readOnly={state.currentUser?.receiverPhoneNumber}
                    />
                    <Form.Control.Feedback type="invalid" tooltip>
                      {errors.receiverPhoneNumber}
                    </Form.Control.Feedback>
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
              <InputGroup hasValidation>
                <Form.Select
                  aria-label="collection-select"
                  onChange={(event) => {
                    handleChange(event);
                    dispatch({ type: 'setDeliveryMethod', payload: DELIVERY_METHODS.find((method) => method.id === +event.target.value) });
                    setDeliveryMethod(
                      DELIVERY_METHODS.find((method) => method.id === +event.target.value),
                    );
                  }}
                  title="delMethod"
                  placeholder="Category"
                  isInvalid={errors.delMethod}
                  isValid={!!errors.delMethod}
                //  defaultValue={existingBook?.category || null}
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

                <Form.Control.Feedback type="invalid" tooltip>
                  {errors.delMethod}
                </Form.Control.Feedback>
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
                    name="city"
                    value={values.city}
                    onChange={handleChange}
                    isInvalid={!!errors.city}
                  />

                  <Form.Control.Feedback type="invalid" tooltip>
                    {errors.city}
                  </Form.Control.Feedback>
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
                    name="street"
                    value={values.street}
                    onChange={handleChange}
                    isInvalid={!!errors.street}
                  />
                  <Form.Control.Feedback type="invalid" tooltip>
                    {errors.street}
                  </Form.Control.Feedback>
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
                    name="houseNr"
                    value={values.houseNr}
                    onChange={handleChange}
                    isInvalid={!!errors.houseNr}
                  />

                  <Form.Control.Feedback type="invalid" tooltip>
                    {errors.houseNr}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group
                  as={Col}
                  md="3"
                  controlId="validationFormik1051"
                  className="position-relative"
                >
                  <Form.Label>{t('pages.order.form.house-nr')}</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder={t('pages.order.form.house-nr')}
                    name="flatNr"
                    value={values.flatNr}
                    onChange={handleChange}
                    isInvalid={!!errors.flatNr}
                  />

                  <Form.Control.Feedback type="invalid" tooltip>
                    {errors.flatNr}
                  </Form.Control.Feedback>
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
                    name="city"
                    value={values.city}
                    onChange={handleChange}
                    isInvalid={!!errors.city}
                  />

                  <Form.Control.Feedback type="invalid" tooltip>
                    {errors.city}
                  </Form.Control.Feedback>
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
                    name="branch"
                    value={values.branch}
                    onChange={handleChange}
                    isInvalid={!!errors.branch}
                  />

                  <Form.Control.Feedback type="invalid" tooltip>
                    {errors.branch}
                  </Form.Control.Feedback>
                </Form.Group>
              </>
            )}
            <hr className="my-3" />

            <h2 className="text-start my-1">
              3.
              {' '}
              {t('pages.order.form.payment-method')}
            </h2>
            {/** TODO: translate payments, add liqpay */}
            <Form.Group
              as={Col}
              sm="12"
              controlId="validationFormik10611"
              className="position-relative"
            >
              <InputGroup hasValidation>
                <Form.Group
                  as={Col}
                  md="5"
                  controlId="validationFormik15134"
                  className="position-relative"
                >
                  {PAYMENT_METHODS.map((payMethod, ind) => (
                    <Form.Check
                      required
                      key={payMethod}
                      type="radio"
                      name="paymentMethodId"
                      id={payMethod}
                      label={t(`constants.paymentMethods.${ind}`)}
                      value={+ind}
                      onChange={handleChange}
                      isInvalid={errors.paymentMethodId}
                      className="text-capitalize"
                    />
                  ))}
                  <Form.Control.Feedback type="invalid" tooltip>
                    {errors.paymentMethodId}
                  </Form.Control.Feedback>
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
                name="comments"
                value={values.comments}
                onChange={handleChange}
                isInvalid={!!errors.comments}
              />

              <Form.Control.Feedback type="invalid" tooltip>
                {errors.comments}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>

          <Button type="submit" variant="success">{t('pages.order.form.submit-order')}</Button>
        </Form>
      )}
    </Formik>
  );
}

OrderForm.defaultProps = {
};

OrderForm.propTypes = {
  totalPrice: PropTypes.number.isRequired,
};

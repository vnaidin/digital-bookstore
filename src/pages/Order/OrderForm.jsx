import React, { useContext, useState } from 'react';
import {
  Row, Col, Button, Form, InputGroup,
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import * as formik from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { DELIVERY_METHODS, PAYMENT_METHODS } from '../../utils/constants';
import AppContext from '../../appContext';
import OrderService from '../../services/order';
import { telegramBotSendMsg } from '../../utils/axios';

export default function OrderForm({ totalPrice }) {
  const [deliveryMethod, setDeliveryMethod] = useState();
  const [addReceiver, setReceiver] = useState(false);
  const { dispatch, state } = useContext(AppContext);
  const navigate = useNavigate();
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
    houseNr: yup.number()/* .required() */,
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
        houseNr: +values.houseNr,
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
        dispatch({ type: 'setToast', payload: { body: response.data.message, callee: 'System' } });
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
            <h2 className="text-start my-1">1. Personal Information</h2>
            <Form.Group
              as={Col}
              md="6"
              controlId="validationFormik0131"
              className="position-relative"
            >
              <Form.Label>Name</Form.Label>
              <InputGroup hasValidation>
                <Form.Control
                  type="text"
                  name="name"
                  placeholder="John"
                  value={values.name}
                  onChange={handleChange}
                  isValid={touched.name && !!errors.name}
                  isInvalid={/* touched.surname &&  */errors.name}
                  readOnly={state.currentUser?.name}
                />
                <Form.Control.Feedback tooltip>Looks good!</Form.Control.Feedback>
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
              <Form.Label>Last name</Form.Label>
              <InputGroup hasValidation>
                <Form.Control
                  type="text"
                  name="surname"
                  placeholder="Appleseed"
                  value={values.surname}
                  onChange={handleChange}
                  isValid={touched.surname && !!errors.surname}
                  isInvalid={/* touched.surname &&  */errors.surname}
                  readOnly={state.currentUser?.surname}
                />
                <Form.Control.Feedback tooltip>Looks good!</Form.Control.Feedback>
                <Form.Control.Feedback type="invalid" tooltip>
                  {errors.surname}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            <Form.Group as={Col} sm="12" controlId="validationFormikUsername2">
              <Form.Label>Phone number</Form.Label>
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
              <Form.Label>Email</Form.Label>
              <InputGroup hasValidation>
                <Form.Control
                  type="email"
                  placeholder="John@appleseed.com"
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
              <Form.Label>Receiver</Form.Label>
              <div
                className="d-flex my-0 gap-1 justify-content-center"
              >
                <Form.Check
                  type="radio"
                  label="me"
                  value={0}
                  checked={!addReceiver}
                  onChange={() => setReceiver(false)}
                />
                <Form.Check
                  type="radio"
                  label="not me"
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
                  <Form.Label>Name</Form.Label>
                  <InputGroup hasValidation>
                    <Form.Control
                      type="text"
                      name="receiverName"
                      placeholder="John"
                      value={values.receiverName}
                      onChange={handleChange}
                      isValid={touched.receiverName && !!errors.receiverName}
                      isInvalid={/* touched.surname &&  */errors.receiverName}
                    />
                    <Form.Control.Feedback tooltip>Looks good!</Form.Control.Feedback>
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
                  <Form.Label>Last name</Form.Label>
                  <InputGroup hasValidation>
                    <Form.Control
                      type="text"
                      name="receiverSurname"
                      placeholder="Appleseed"
                      value={values.receiverSurname}
                      onChange={handleChange}
                      isValid={touched.receiverSurname && !!errors.receiverSurname}
                      isInvalid={/* touched.receiverSurname &&  */errors.receiverSurname}
                      readOnly={state.currentUser?.receiverSurname}
                    />
                    <Form.Control.Feedback tooltip>Looks good!</Form.Control.Feedback>
                    <Form.Control.Feedback type="invalid" tooltip>
                      {errors.receiverSurname}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                <Form.Group as={Col} sm="12" controlId="validationFormikUsername2">
                  <Form.Label>Phone number</Form.Label>
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
            <h2 className="text-start my-1">2. Delivery</h2>
            <u className="text-start">
              Orders higher
              {` ${DELIVERY_METHODS[0].freeFrom}₴`}
              {' '}
              have free delivery. Otherwise delivery is paid by customer!
            </u>

            <Form.Group as={Col} sm="12" controlId="delMethod">
              <Form.Label>DeliveryMethod</Form.Label>
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
                  <option hidden value={null}>Choose delivery method</option>
                  {DELIVERY_METHODS.map(
                    ({
                      id, title,
                    }) => (
                      <option
                        key={title}
                        value={+id}
                      >
                        {title}
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
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="City"
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
                  <Form.Label>Street</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Street"
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
                  <Form.Label>House №</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="House №"
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
                  <Form.Label>Flat №</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Flat №"
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
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="City"
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
                  <Form.Label>Branch</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Branch"
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

            <h2 className="text-start my-1">3. Payment Method</h2>
            {/** TODO: */}
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
                      label={payMethod}
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
              <Form.Label>Comments</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Comments"
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

          <Button type="submit" variant="success">Submit Order</Button>
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

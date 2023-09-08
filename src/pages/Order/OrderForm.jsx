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

export default function OrderForm({ totalPrice }) {
  const [deliveryMethod, setDeliveryMethod] = useState();
  const { dispatch, state } = useContext(AppContext);
  const navigate = useNavigate();
  const { Formik } = formik;

  const schema = yup.object().shape({ // TODO: validation to improve
    name: yup.string().required().min(3),
    surname: yup.string().required().min(3),
    phoneNumber: yup.string().required(),
    email: yup.string().required().email(),
    city: yup.string().required().min(2),
    address: yup.string()/* .required() */,
    // zip: yup.string().required(),
    branch: yup.string()/* .required() */,
    paymentMethodId: yup.number().required(),
    delMethod: yup.number().required(),
    comments: yup.string()/* .required() */,
  });

  const handleOrderSubmit = (values) => {
    const objectToPost = {
      ...values,
      userId: state?.currentUser?.id,
      items: state.shoppingCart.map((item) => item.id).toString(),
      price: totalPrice,
      status: 0,
    };
    //  console.log(objectToPost);
    OrderService.createOrder(objectToPost).then(
      (response) => {
        // console.log(response);
        localStorage.setItem('cart', JSON.stringify([]));
        dispatch({ type: 'setToast', payload: { body: response.data.message, callee: 'System' } });
        setTimeout(() => {
          dispatch({ type: 'addItemToCart', payload: [] });
          navigate('/');
        }, 3000);
      },
    ).catch((e) => console.error(new Error(e)));
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
                  readOnly={state.currentUser?.id > 0}
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
                  readOnly={state.currentUser?.id > 0}
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
                  readOnly={state.currentUser?.id > 0}
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

            <h2 className="text-start my-1">2. Delivery</h2>

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
                      id, title, cost, /* freeFrom, */
                    }) => (
                      <option
                        key={title}
                        value={+id}
                      >
                        {title}
                        {' '}
                        (
                        {`${cost} UAH`}
                        )
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
              <>
                <Form.Group
                  as={Col}
                  md="3"
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
                  md="9"
                  controlId="validationFormik104"
                  className="position-relative"
                >
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Address"
                    name="address"
                    value={values.address}
                    onChange={handleChange}
                    isInvalid={!!errors.address}
                  />
                  <Form.Control.Feedback type="invalid" tooltip>
                    {errors.address}
                  </Form.Control.Feedback>
                </Form.Group>
                {/* <Form.Group
                  as={Col}
                  md="3"
                  controlId="validationFormik105"
                  className="position-relative"
                >
                  <Form.Label>Zip</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Zip"
                    name="zip"
                    value={values.zip}
                    onChange={handleChange}
                    isInvalid={!!errors.zip}
                  />

                  <Form.Control.Feedback type="invalid" tooltip>
                    {errors.zip}
                  </Form.Control.Feedback>
                </Form.Group> */}
              </>
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

import React, { useContext, useState } from 'react';
import {
  Button, Form, InputGroup, Row,
} from 'react-bootstrap';
import * as formik from 'formik';
import * as yup from 'yup';
import AuthService from '../../../services/auth';
import AppContext from '../../../appContext';

export default function Login() {
  const [forgotPass, setForgotPass] = useState(false);
  const { Formik } = formik;
  const { dispatch } = useContext(AppContext);
  const schema = yup.object().shape({
    email: yup.string().required().email(),
    password: forgotPass ? yup.string().max(0) : yup.string().required(),
  });

  const logIn = (values) => {
    AuthService.login(values);
    setTimeout(() => {
      dispatch({ type: 'logIn', payload: JSON.parse(sessionStorage.getItem('user')) });
    }, 500);
  };

  const requestForgotPassword = (values) => {
    AuthService.requestForgotPassword(values)
      .then((response) => {
        dispatch({ type: 'setToast', payload: { body: response.data.message, callee: 'System' } });
      }).catch((error) => {
        dispatch({ type: 'setToast', payload: { body: error?.message, callee: 'System' } });
      });
  };

  return (
    <Formik
      validationSchema={schema}
      // eslint-disable-next-line no-unused-expressions
      onSubmit={(values) => { forgotPass ? requestForgotPassword(values) : logIn(values); }}
      initialValues={{
        email: '',
        password: '',
      }}
    >
      {({
        handleSubmit, handleChange, values, touched, errors,
      }) => (
        <Form noValidate onSubmit={handleSubmit} className="d-flex flex-column">
          <Row className="m-1 p-0">
            <Form.Group as={Row} className="p-0" controlId="validationFormik01">
              <Form.Label>Email</Form.Label>
              <InputGroup hasValidation>
                <Form.Control
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  isValid={touched.email && !!errors.email}
                  isInvalid={errors.email}
                />
                <Form.Control.Feedback tooltip>Looks good!</Form.Control.Feedback>
                <Form.Control.Feedback type="invalid" tooltip>
                  {errors.email}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
            {!forgotPass && (
            <Form.Group as={Row} controlId="validationFormik02">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={values.password}
                onChange={handleChange}
                isValid={touched.password && !!errors.password}
              />
            </Form.Group>
            )}
          </Row>
          <Button
            type="submit"
            variant="link"
            className="my-2"
            onClick={() => setForgotPass(true)}
          >
            Forgot password?
          </Button>
          <Button
            type="submit"
            className="my-2 align-self-center"
            style={{ width: '6em' }}
          >
            {forgotPass ? 'Reset Password' : 'Login'}
          </Button>
        </Form>
      )}
    </Formik>
  );
}

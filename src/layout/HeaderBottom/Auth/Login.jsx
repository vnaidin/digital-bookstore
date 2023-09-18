import React, { useContext } from 'react';
import {
  Button, Form, InputGroup, Row, Col,
} from 'react-bootstrap';
import * as formik from 'formik';
import * as yup from 'yup';
import AuthService from '../../../services/auth';
import AppContext from '../../../appContext';

export default function Login() {
  const { Formik } = formik;
  const { dispatch } = useContext(AppContext);
  const schema = yup.object().shape({
    email: yup.string().required().email(),
    password: yup.string().required(),
  });

  const logIn = (values) => {
    AuthService.login(values);
    setTimeout(() => {
      dispatch({ type: 'logIn', payload: JSON.parse(sessionStorage.getItem('user')) });
    }, 500);
  };

  return (
    <Formik
      validationSchema={schema}
      onSubmit={(values) => logIn(values)}
      initialValues={{
        email: 'John@gmail.com',
        password: '@\'Sq12RR',
      }}
    >
      {({
        handleSubmit, handleChange, values, touched, errors,
      }) => (
        <Form noValidate onSubmit={handleSubmit} className="d-flex flex-column">
          <Row className="mb-3">
            <Form.Group as={Col} controlId="validationFormik01">
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
            <Form.Group as={Col} controlId="validationFormik02">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={values.password}
                onChange={handleChange}
                isValid={touched.password && !!errors.password}
              />

            </Form.Group>
          </Row>

          <Button type="submit">Login</Button>
        </Form>
      )}
    </Formik>
  );
}

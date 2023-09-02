import React from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import * as formik from 'formik';
import * as yup from 'yup';
import AuthService from '../../services/auth';

export default function Login() {
  const { Formik } = formik;

  const schema = yup.object().shape({
    email: yup.string().required(),
    // password: yup.string().required(),
  });

  return (
    <Formik
      validationSchema={schema}
      onSubmit={AuthService.login}
      initialValues={{
        email: '',
        password: '',
      }}
    >
      {({
        handleSubmit, handleChange, values, touched, errors,
      }) => (
        <Form noValidate onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Form.Group as={Col} md="4" controlId="validationFormik01">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={values.email}
                onChange={handleChange}
                isValid={touched.email && !errors.email}
              />
            </Form.Group>
            <Form.Group as={Col} md="4" controlId="validationFormik02">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={values.password}
                onChange={handleChange}
                isValid={touched.password && !errors.password}
              />

            </Form.Group>
          </Row>

          <Button type="submit">Login</Button>
        </Form>
      )}
    </Formik>
  );
}

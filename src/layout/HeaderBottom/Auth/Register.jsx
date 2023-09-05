import React from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import * as formik from 'formik';
import * as yup from 'yup';

import AuthService from '../../../services/auth';

export default function Register() {
  const { Formik } = formik;

  const schema = yup.object().shape({
    email: yup.string().required(),
    password: yup.string().required(),
  });

  return (
    <Formik
      validationSchema={schema}
      onSubmit={AuthService.register}
      initialValues={{
        email: 'John@gmail.com',
        password: '',
      }}
    >
      {({
        handleSubmit, handleChange, values, touched, errors,
      }) => (
        <Form noValidate onSubmit={handleSubmit} className="d-flex flex-column">
          <Row className="mb-3">
            <Form.Group as={Col} controlId="validationFormik011">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={values.email}
                onChange={handleChange}
                isValid={touched.email && !errors.email}
              />
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} controlId="validationFormik021">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={values.password}
                onChange={handleChange}
                isValid={touched.password && !errors.password}
              />

              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Button type="submit">Register</Button>
        </Form>
      )}
    </Formik>
  );
}

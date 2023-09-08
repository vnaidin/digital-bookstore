import React from 'react';
import {
  Button, Form, InputGroup, Row, Col,
} from 'react-bootstrap';
import * as formik from 'formik';
import * as yup from 'yup';

import AuthService from '../../../services/auth';

export default function Register() {
  const { Formik } = formik;

  const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,}$/;
  // min 5 characters, 1 upper case letter, 1 lower case letter, 1 numeric digit.
  const schema = yup.object().shape({
    email: yup.string().required().email(),
    password: yup
      .string()
      .matches(passwordRules, { message: 'Please create a stronger password' })
      .required('Required'),
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
              <InputGroup hasValidation>
                <Form.Control
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  isValid={touched.email && !errors.email}
                  isInvalid={errors.email}
                />
                <Form.Control.Feedback tooltip>Looks good!</Form.Control.Feedback>
                <Form.Control.Feedback type="invalid" tooltip>
                  {errors.email}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
            <Form.Group as={Col} controlId="validationFormik021">
              <Form.Label>Password</Form.Label>
              <InputGroup hasValidation>
                <Form.Control
                  type="password"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  isValid={touched.password && !errors.password}
                  isInvalid={errors.password}
                />
                <Form.Control.Feedback tooltip>Looks good!</Form.Control.Feedback>
                <Form.Control.Feedback type="invalid" tooltip>
                  {errors.password}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
          </Row>
          <Button type="submit">Register</Button>
        </Form>
      )}
    </Formik>
  );
}

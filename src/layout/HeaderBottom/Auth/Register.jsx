import React from 'react';
import {
  Button, Form, InputGroup, Row,
} from 'react-bootstrap';
import * as formik from 'formik';
import * as yup from 'yup';

import { useTranslation } from 'react-i18next';
import AuthService from '../../../services/auth';

export default function Register() {
  const { Formik } = formik;
  const { t } = useTranslation();

  const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,}$/;
  // min 5 characters, 1 upper case letter, 1 lower case letter, 1 numeric digit.
  const schema = yup.object().shape({
    name: yup.string().required().min(2),
    email: yup.string().required().email(),
    password: yup
      .string()
      .matches(passwordRules, { message: 'Please create a stronger password' })
      .required('Required'),
  });// TODO: translate

  return (
    <Formik
      validationSchema={schema}
      onSubmit={AuthService.register}
      initialValues={{
        name: '',
        email: '',
        password: '',
      }}
    >
      {({
        handleSubmit, handleChange, values, touched, errors,
      }) => (
        <Form noValidate onSubmit={handleSubmit} className="d-flex flex-column">
          <Row className="my-1">
            <Form.Group as={Row} controlId="validationFormik2011">
              <Form.Label>{t('layout.headerBottom.auth.form.name')}</Form.Label>
              <InputGroup hasValidation>
                <Form.Control
                  type="text"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  isValid={touched.name && !errors.name}
                  isInvalid={errors.name}
                />
                <Form.Control.Feedback tooltip>{t('layout.headerBottom.auth.form.valid-feedback')}</Form.Control.Feedback>
                <Form.Control.Feedback type="invalid" tooltip>
                  {errors.name}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
            <Form.Group as={Row} controlId="validationFormik011">
              <Form.Label>{t('layout.headerBottom.auth.form.email')}</Form.Label>
              <InputGroup hasValidation>
                <Form.Control
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  isValid={touched.email && !errors.email}
                  isInvalid={errors.email}
                />
                <Form.Control.Feedback tooltip>{t('layout.headerBottom.auth.form.valid-feedback')}</Form.Control.Feedback>
                <Form.Control.Feedback type="invalid" tooltip>
                  {errors.email}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
            <Form.Group as={Row} controlId="validationFormik021">
              <Form.Label>{t('layout.headerBottom.auth.form.pass')}</Form.Label>
              <InputGroup hasValidation>
                <Form.Control
                  type="password"
                  name="password"
                  autoComplete="new-password"
                  value={values.password}
                  onChange={handleChange}
                  isValid={touched.password && !errors.password}
                  isInvalid={errors.password}
                />
                <Form.Control.Feedback tooltip>{t('layout.headerBottom.auth.form.valid-feedback')}</Form.Control.Feedback>
                <Form.Control.Feedback type="invalid" tooltip>
                  {errors.password}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
          </Row>
          <Button
            type="submit"
            style={{ backgroundColor: '#748492', fontWeight: '900' }}
            className="my-2 align-self-center"
          >
            {t('layout.headerBottom.auth.register')}

          </Button>
        </Form>
      )}
    </Formik>
  );
}

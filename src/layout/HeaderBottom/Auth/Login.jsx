import React, { useContext, useState } from 'react';
import {
  Button, Form, InputGroup, Row,
} from 'react-bootstrap';
import * as formik from 'formik';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import AuthService from '../../../services/auth';
import AppContext from '../../../appContext';

export default function Login() {
  const [forgotPass, setForgotPass] = useState(false);
  const { t } = useTranslation();
  const { Formik } = formik;
  const { dispatch } = useContext(AppContext);
  const schema = yup.object().shape({
    email: yup.string().required().email(),
    password: forgotPass ? yup.string().max(0) : yup.string().required(),
  });

  const logIn = (values) => {
    AuthService.login(values);
    setTimeout(() => {
      dispatch({ type: 'logIn', payload: JSON.parse(localStorage.getItem('user')) });
    }, 500);
  };

  const requestForgotPassword = (values) => {
    AuthService.requestForgotPassword(values)
      .then((response) => {
        dispatch({ type: 'setToast', payload: { body: response.data.message, callee: t('toasts.callee-sys') } });
      }).catch((error) => {
        dispatch({ type: 'setToast', payload: { body: error?.message, callee: t('toasts.callee-sys') } });
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
              <Form.Label>{t('layout.headerBottom.auth.form.email')}</Form.Label>
              <InputGroup hasValidation>
                <Form.Control
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  isValid={touched.email && !!errors.email}
                  isInvalid={errors.email}
                />
                <Form.Control.Feedback tooltip>{t('layout.headerBottom.auth.form.valid-feedback')}</Form.Control.Feedback>
                <Form.Control.Feedback type="invalid" tooltip>
                  {errors.email}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
            {!forgotPass && (
            <Form.Group as={Row} controlId="validationFormik02">
              <Form.Label>{t('layout.headerBottom.auth.form.pass')}</Form.Label>
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
      // style={{ backgroundColor: '#05aac2', fontWeight: '900' }}
            className="my-2"
            onClick={() => setForgotPass(true)}
          >
            {t('layout.headerBottom.auth.form.forgot-pass')}
          </Button>
          <Button
            type="submit"
            className="my-2 align-self-center"
            style={{ backgroundColor: '#05aac2', fontWeight: '900' }}

          >
            {forgotPass ? t('layout.headerBottom.auth.reset-pass') : t('layout.headerBottom.auth.login')}
          </Button>
        </Form>
      )}
    </Formik>
  );
}

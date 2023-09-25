import React, { useContext } from 'react';
import {
  Button, Form, Row, InputGroup, Col,
} from 'react-bootstrap';
import * as formik from 'formik';
import * as yup from 'yup';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AppContext from '../../appContext';
import AuthService from '../../services/auth';

export default function PassReset() {
  const { Formik } = formik;
  const { t } = useTranslation();
  const { dispatch } = useContext(AppContext);
  const schema = yup.object().shape({
    password: yup.string().required(),
  });

  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const userId = searchParams.get('id');
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const handleResetPass = (values) => {
    AuthService.resetPassword({ token, id: userId, password: values.password }).then((response) => {
      dispatch({ type: 'setToast', payload: { body: response.data.message, callee: t('toasts.callee-sys') } });
      navigate('/');
    }).catch((error) => {
      dispatch({ type: 'setToast', payload: { body: error?.message, callee: t('toasts.callee-sys') } });
    });
  };

  return (
    <Formik
      validationSchema={schema}
      // eslint-disable-next-line no-unused-expressions
      onSubmit={(values) => { handleResetPass(values); }}
      initialValues={{
        password: '',
      }}
    >
      {({
        handleSubmit, handleChange, values, touched, errors,
      }) => (
        <Form noValidate onSubmit={handleSubmit} className="d-flex flex-column">
          <Row className="m-1 p-0">
            <Form.Group as={Col} controlId="validationFormik021">
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
            className="my-2 align-self-center"
            style={{ width: '6em' }}
          >
            {t('layout.headerBottom.auth.form.reset-pass')}
          </Button>
        </Form>
      )}
    </Formik>
  );
}

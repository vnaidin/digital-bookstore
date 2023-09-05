import React, { useContext } from 'react';
import {
  Button, ListGroup, Table, Row, Form, Col, InputGroup,
} from 'react-bootstrap';
import * as formik from 'formik';
import * as yup from 'yup';
import AuthService from '../../../services/auth';
import AppContext from '../../../appContext';
import UserService from '../../../services/user';

export default function UserPanel() {
  const { state, dispatch } = useContext(AppContext);
  const logout = () => {
    AuthService.logout();
    dispatch({ type: 'logOut' });
  };
  const { Formik } = formik;

  const schema = yup.object().shape({
    name: yup.string().required(),
    surname: yup.string().required(),
    phoneNumber: yup.number().required(),
  });

  const handleUpdateUserInfoSubmit = (values) => {
    UserService.editUser(state.currentUser.id, values);// TODO: add then catch
  };
  return (
    <>
      <Row className="my-3">

        Roles:
        <ListGroup>
          {state?.currentUser?.roles.map((role) => (
            <ListGroup.Item
              key={role}
            >
              {role}
            </ListGroup.Item>
          ))}
          <ListGroup.Item key="jwt">{state?.currentUser?.accessToken}</ListGroup.Item>
        </ListGroup>
      </Row>
      <Row className="my-3">
        <h4>User Info</h4>
        <Formik
          validationSchema={schema}
          onSubmit={handleUpdateUserInfoSubmit}
          initialValues={{
            name: state?.currentUser?.name || '',
            surname: state?.currentUser?.surname || '',
            phoneNumber: state?.currentUser?.phoneNumber || '',
          }}
        >
          {({
            handleSubmit, handleChange, values, touched, errors,
          }) => (
            <Form noValidate onSubmit={handleSubmit}>
              <Row className="mb-3">
                <Form.Group
                  as={Col}
                  md="6"
                  controlId="validationFormik010"
                  className="position-relative"
                >
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    isValid={touched.name && !errors.name}
                  />
                  <Form.Control.Feedback tooltip>Looks good!</Form.Control.Feedback>
                </Form.Group>
                <Form.Group
                  as={Col}
                  md="6"
                  controlId="validationFormik1020"
                  className="position-relative"
                >
                  <Form.Label>Last name</Form.Label>
                  <Form.Control
                    type="text"
                    name="surname"
                    value={values.surname}
                    onChange={handleChange}
                    isValid={touched.surname && !errors.surname}
                  />

                  <Form.Control.Feedback tooltip>Looks good!</Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} sm="12" controlId="validationFormikUsername200">
                  <Form.Label>Phone number</Form.Label>
                  <InputGroup hasValidation>
                    <Form.Control
                      type="phoneNumber"
                      placeholder="095 123 45 67"
                      width={100}
                      aria-describedby="inputGroupPrepend"
                      name="phoneNumber"
                      value={values.phoneNumber}
                      onChange={handleChange}
                      isInvalid={!!errors.phoneNumber}
                    />
                    <Form.Control.Feedback type="invalid" tooltip>
                      {errors.phoneNumber}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
              </Row>
              <Button type="submit" variant="success">Save changes</Button>
            </Form>
          )}
        </Formik>
      </Row>

      <Row className="my-3">
        <h4>Orders</h4>
        <Table
          striped
          bordered
          hover
          responsive
        >
          <thead>
            <tr>
              <th>#</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Username</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Mark</td>
              <td>Otto</td>
              <td>@mdo</td>
            </tr>
            <tr>
              <td>2</td>
              <td>Jacob</td>
              <td>Thornton</td>
              <td>@fat</td>
            </tr>
            <tr>
              <td>3</td>
              <td colSpan={2}>Larry the Bird</td>
              <td>@twitter</td>
            </tr>
          </tbody>
        </Table>
      </Row>

      <Button variant="danger" onClick={logout}>Log out</Button>
    </>
  );
}

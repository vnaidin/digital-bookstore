import React, { useState, useContext } from 'react';
import { Button, Offcanvas, Row } from 'react-bootstrap';
import { FiUser } from 'react-icons/fi';
import Register from './Register';
import Login from './Login';
import AppContext from '../../../appContext';
import UserPanel from './UserPanel';

export default function Auth() {
  const [show, setShow] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const { state } = useContext(AppContext);

  const handleCloseCanvas = () => setShow(false);
  const handleShowCanvas = () => setShow(true);
  const handleComponentSwitch = () => setShowRegister((prev) => !prev);

  const notLoggedView = (
    <>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>{showRegister ? 'Register' : 'Log In'}</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <Row className="justify-content-center">
          {showRegister ? <Register /> : <Login />}
          <p className="text-center">or</p>
          <u
            className="text-center"
            onClick={handleComponentSwitch}
            role="none"
          >
            {!showRegister ? 'Register' : 'Log In'}
          </u>
        </Row>
      </Offcanvas.Body>
    </>
  );

  const loggedView = (
    <>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>{`Hello ${state?.currentUser?.name || state?.currentUser?.email}!`}</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <UserPanel />
      </Offcanvas.Body>
    </>
  );
  return (
    <>
      <Button
        className="col"
        variant="link"
        onClick={handleShowCanvas}
      >
        <FiUser size={20} />
      </Button>

      <Offcanvas
        show={show}
        onHide={handleCloseCanvas}
        placement="end"
        // responsive="xxl"
        backdrop
        scroll
      >
        {state?.currentUser !== undefined ? loggedView : notLoggedView }
      </Offcanvas>
    </>
  );
}

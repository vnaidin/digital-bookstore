import React, { useState, useContext } from 'react';
import { Button, Offcanvas, Row } from 'react-bootstrap';
import { FiUser } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import Register from './Register';
import Login from './Login';
import AppContext from '../../../appContext';
import UserPanel from './UserPanel';

export default function Auth() {
  const { state } = useContext(AppContext);
  const { t } = useTranslation();
  const [show, setShow] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const handleCloseCanvas = () => setShow(false);
  const handleShowCanvas = () => setShow(true);
  const handleComponentSwitch = () => setShowRegister((prev) => !prev);

  const notLoggedView = (
    <>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>{showRegister ? t('layout.headerBottom.auth.register') : t('layout.headerBottom.auth.login')}</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <Row className="justify-content-center">
          {showRegister ? <Register /> : <Login />}
          <p className="text-center">{t('layout.headerBottom.auth.or')}</p>
          <u
            className="text-center"
            onClick={handleComponentSwitch}
            role="none"
          >
            {!showRegister ? t('layout.headerBottom.auth.register') : t('layout.headerBottom.auth.login')}
          </u>
        </Row>
      </Offcanvas.Body>
    </>
  );

  const loggedView = (
    <>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>{`${t('layout.headerBottom.greeting')} ${state?.currentUser?.name || state?.currentUser?.email}!`}</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <UserPanel />
      </Offcanvas.Body>
    </>
  );
  return (
    <>
      <Button
        className="col d-flex align-items-center justify-content-center gap-1"
        // variant="light"
        onClick={handleShowCanvas}
        style={{
          backgroundColor: '#748492', border: 'none', fontSize: 'large',
        }}
      >
        {window.innerWidth > 768 ? (
          <>
            <FiUser size={20} />
            {t('layout.headerBottom.auth.title')}
          </>
        ) : <FiUser size={20} />}
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

import React, { useEffect, useContext } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';
import AppContext from '../../appContext';
import logo from '../../logo.svg';

export default function InfoToast() {
  const { state, dispatch } = useContext(AppContext);

  const closeToast = () => dispatch({ type: 'setToast', payload: null });

  useEffect(() => {
    const timeout = setTimeout(
      () => { closeToast(); },
      1000 * (state.toast?.visible || 5),
    );
    return () => clearTimeout(timeout);
  }, [state.toast]);
  // console.log(document.body.getBoundingClientRect());
  return (
    <ToastContainer
      className="p-3 mb-3"
      position="middle-center"
      /* style={{
        zIndex: '1100',
        position: 'absolute',
        top: document.body.getBoundingClientRect().top * -1,
        right: '0',
      }} */
    >
      <Toast
        show={state.toast !== null}
        onClose={() => closeToast()}
        animation
        // bg={variant}
      >
        <Toast.Header>
          <img
            src={logo}
            width={20}
            height={20}
            className="rounded me-2"
            alt="img-to-be-here"
          />
          <strong className="me-auto">{state.toast?.callee}</strong>
        </Toast.Header>
        <Toast.Body>{state.toast?.body || ''}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
}

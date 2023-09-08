import React, { useState } from 'react';
import { Button, Offcanvas } from 'react-bootstrap';

export default function Catalog() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <>
      <Button
        className="col"
        variant="dark"
        onClick={handleShow}
      >
        Catalogue
      </Button>

      <Offcanvas
        show={show}
        onHide={handleClose}
        scroll
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Catalogue</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          Some text as placeholder. In real life you can have the elements you
          have chosen. Like, text, images, lists, etc.
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

import React from 'react';
import { Container, Navbar, Col } from 'react-bootstrap';
import logo from '../../logo.svg';

export default function Header() {
  return (
    <Container as="header" className="p-2 mb-2">

      <Navbar.Brand
        href="/"
        className="col d-flex align-items-center"
      >
        <img alt="logo" src={logo} width={150} />
      </Navbar.Brand>

      <Col className="wallet-connect" />

    </Container>
  );
}

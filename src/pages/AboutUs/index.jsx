import React from 'react';
import { Container, Row } from 'react-bootstrap';
import { Helmet } from 'react-helmet';

export default function AboutUs() {
  return (
    <Container>
      <Helmet>
        <title>About Us</title>
      </Helmet>
      <Row className="my-2"><h2>About us</h2></Row>
      <Row>SOME TEXT</Row>
    </Container>
  );
}

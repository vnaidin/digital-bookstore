import React from 'react';
import { Container, Row } from 'react-bootstrap';
import { Helmet } from 'react-helmet';

export default function Contacts() {
  return (
    <Container>
      <Helmet>
        <title>Contacts</title>
      </Helmet>
      <Row className="my-2"><h2>Contacts</h2></Row>
      <Row>SOME TEXT</Row>
      <Row>
        <p>
          Email -
          <strong>
            <a
              href="mailto:alineabookshop@gmail.com"
              rel="nofollow"
            >
              alineabookshop@gmail.com
            </a>
          </strong>
        </p>
        <p>
          Tel -
          <strong>
            <a
              href="tel:+380636320017"
              rel="nofollow"
            >
              +380 (63) 632 00 17
            </a>
          </strong>
        </p>
      </Row>
    </Container>
  );
}

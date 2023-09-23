import React from 'react';
import { Container, Row } from 'react-bootstrap';
import { Helmet } from 'react-helmet';

export default function TermsOfUse() {
  return (
    <Container>
      <Helmet>
        <title>Terms of use</title>
      </Helmet>
      <Row className="my-2">
        <h3>TermsOfUse</h3>
      </Row>
      <Row>
        text
        lots of ul and li
      </Row>
    </Container>
  );
}

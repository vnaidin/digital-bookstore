import React from 'react';
import { Container, Row } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { DELIVERY_METHODS } from '../../utils/constants';

export default function Delivery() {
  return (
    <Container>
      <Helmet>
        <title>Delivery</title>
      </Helmet>
      <Row className="my-2"><h2>Delivery</h2></Row>
      <Row>
        <h3>
          <strong className="text-danger text-large">
            Free delivery from
            {' '}
            {DELIVERY_METHODS[0].freeFrom}
          </strong>

        </h3>
      </Row>
      {DELIVERY_METHODS.map(({ id, title }) => (
        <section key={id}>
          <Row className="my-2"><h3>{title}</h3></Row>
          <Row>description</Row>
        </section>
      ))}
    </Container>
  );
}

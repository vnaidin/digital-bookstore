import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';

export default function Footer() {
  return (
    <Container as="footer" className="py-3">
      <Row>
        <Col>Useful links:</Col>
        <Col>Telegram</Col>
        <Col>TikTok</Col>
      </Row>
    </Container>
  );
}

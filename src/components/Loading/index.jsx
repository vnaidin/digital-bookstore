import React from 'react';
import { Row, Spinner } from 'react-bootstrap';

export default function LoadingComponent() {
  return (
    <Row className="justify-content-center align-items-center" style={{ height: '400px' }}>
      <Spinner animation="border" />
    </Row>
  );
}

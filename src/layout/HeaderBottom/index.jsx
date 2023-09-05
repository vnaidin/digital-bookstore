import React from 'react';
import { Container, Row } from 'react-bootstrap';
import Catalog from './Catalog';
import SearchBar from './Search';
import ShoppingCart from './ShoppingCart';
import Auth from './Auth';

export default function HeaderBottom() {
  return (
    <Container fluid className="header-bottom px-3 py-1 sticky-top">
      <Row className="gap-1">
        <Catalog />
        <SearchBar />
        <ShoppingCart />
        <Auth />
      </Row>
    </Container>
  );
}

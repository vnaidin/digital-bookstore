import React from 'react';
import { Container, Row } from 'react-bootstrap';
import Catalog from './Catalog';
import SearchBar from './Search';
import ShoppingCart from './ShoppingCart';
import Auth from './Auth';

export default function HeaderBottom() {
  return (
    <Container fluid className="header-bottom px-4 py-1 sticky-top">
      <Row className="gap-2 my-2">
        <Catalog />
        <SearchBar />
        <Auth />
        <ShoppingCart />
      </Row>
    </Container>
  );
}

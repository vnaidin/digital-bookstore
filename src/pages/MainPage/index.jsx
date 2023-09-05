/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Container, Row, Spinner } from 'react-bootstrap';
import { useFetch } from '../../utils/hooks';
import BookCard from '../../components/BookCard';

export default function Main() {
  const { loading, error, value } = useFetch(
    `${process.env.REACT_APP_BE_URL}/all/books`,
    {},
    [],
  );

  return (
    <Container>
      <Row className="my-2">
        {error && (
        <p>
          {new Error(error).message}
        </p>
        )}
        {loading && (
        <Spinner animation="border" />
        )}
      </Row>
      <Row className="my-2 ">
        {value && value.map((bookObj) => <BookCard {...bookObj} key={bookObj.id} />)}
      </Row>
    </Container>
  );
}

import React from 'react';
import { Container, Row, Spinner } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useFetch } from '../../utils/hooks';

export default function BookPage() {
  const { id } = useParams();
  const { loading, error, value } = useFetch(
    `${process.env.REACT_APP_BE_URL}/book/${id}`,
    {},
    [],
  );
  // console.log(value);
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
      BookPage page id:
      {id}
      Book Title:
      {value?.title}
    </Container>
  );
}

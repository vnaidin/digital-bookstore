import React from 'react';
import {
  Col, Container, Row, Spinner, Image, ListGroup,
} from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useFetch } from '../../utils/hooks';
import BuyButton from '../../components/BuyButton';
import { BOOK_CATEGORIES, BOOK_COVER_TYPES } from '../../utils/constants';

export default function BookPage() {
  const { id } = useParams();
  const { loading, error, value } = useFetch(
    `${process.env.REACT_APP_BE_URL}/book/${id}`,
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
      <Row>
        <Col
          xs={12}
          sm={6}
          md={6}
          lg={6}
          xl={6}
          xxl={6}
        >
          <Image
            src={value?.image}
            className="p-2"
            alt={value?.title}
            width={300}
            rounded
            fluid
          />
        </Col>

        <Col
          xs={12}
          sm={6}
          md={6}
          lg={6}
          xl={6}
          xxl={6}
        >
          <Row>
            <h2>
              {value?.title}
            </h2>
          </Row>
          <Row className="mx-0 my-2 text-start">
            <ListGroup>
              <ListGroup.Item>
                {`Author: ${value?.author}`}
              </ListGroup.Item>
              <ListGroup.Item>
                {`Year: ${value?.year}`}
              </ListGroup.Item>
              <ListGroup.Item>
                {`Language: ${value?.lang}`}
              </ListGroup.Item>
              <ListGroup.Item>
                {`Cover: ${BOOK_COVER_TYPES[value?.coverType]}`}
              </ListGroup.Item>
              <ListGroup.Item>
                {`Page count: ${value?.pageCount}`}
              </ListGroup.Item>
              <ListGroup.Item>
                {`ISBN: ${value?.isbn}`}
              </ListGroup.Item>
              <ListGroup.Item>
                {`Publisher: ${value?.publisher}`}
              </ListGroup.Item>
              <ListGroup.Item>
                {`Category: ${BOOK_CATEGORIES[value?.category]}`}
              </ListGroup.Item>
            </ListGroup>
            {/** TODO: add price */}
          </Row>
          <BuyButton id={id} price={value?.price} title={value?.title} image={value?.image} />
        </Col>
      </Row>
      <Row className="my-3">
        <h4>Annotation:</h4>
        <p style={{ textAlign: 'justify' }}>{value?.annotation}</p>
      </Row>
    </Container>
  );
}

import React from 'react';
import {
  Col, Container, Row, Spinner, Image,
} from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useFetch } from '../../utils/hooks';

export default function NewsPage() {
  const { id } = useParams();
  const { loading, error, value } = useFetch(
    `${process.env.REACT_APP_BE_URL}/api/news/${id}`,
    {},
    [],
  );
  return (
    <Container style={{ padding: '3em 0px' }}>
      <Helmet>
        <title>{value?.title}</title>
      </Helmet>
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
      {value && (
      <>
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
              <p style={{ textAlign: 'justify' }}>{value?.text}</p>
            </Row>
          </Col>
        </Row>
        <Row className="my-3">
          <p style={{ textAlign: 'end', fontSize: 'larger' }}>{value?.author}</p>
          <p style={{ textAlign: 'end' }}>{new Date(value?.createdAt).toLocaleDateString()}</p>
        </Row>
      </>
      )}
    </Container>
  );
}

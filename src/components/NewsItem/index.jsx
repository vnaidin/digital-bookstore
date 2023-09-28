import React from 'react';
import {
  Card, Col, NavLink,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { newsType } from '../../utils/types';

export default function NewsItem({
  id, author, title, image,
}) {
  const navigate = useNavigate();
  return (
    <Col
      xs={12}
      sm={6}
      md={6}
      lg={4}
      xl={4}
      xxl={4}
      className="d-flex justify-content-center my-1"
    >
      <Card style={{ backgroundColor: 'inherit' }}>
        <Card.Img
          variant="top"
          src={image}
          width={300}
          className="p-3"
          alt={`${author}_${title}`}
          onClick={() => navigate(`/merch/${id}`)}

        />
        <Card.Body className="d-flex flex-column align-items-center justify-content-end py-2">
          <NavLink href={`/news/${id}`}>
            <Card.Title>{title}</Card.Title>
          </NavLink>
          <Card.Subtitle style={{
            width: '200px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
          }}
          >
            {author}
          </Card.Subtitle>
          <div className="d-flex m-2 p-1 gap-1 justify-content-center">
            <div className="d-flex flex-column" />
          </div>

        </Card.Body>
      </Card>
    </Col>
  );
}

NewsItem.defaultProps = {
  id: null,
  author: null,
  title: null,
  image: null,
};

NewsItem.propTypes = newsType.isRequired;

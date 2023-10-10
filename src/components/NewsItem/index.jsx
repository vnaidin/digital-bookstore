import React from 'react';
import {
  Card, NavLink,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { newsType } from '../../utils/types';

export default function NewsItem({
  id, author, title, image,
}) {
  const navigate = useNavigate();
  return (

    <Card style={{ backgroundColor: 'inherit' }}>
      <Card.Img
        variant="top"
        // src={image}
        src={`${process.env.REACT_APP_BE_URL}/${image}`}
        height={330}
        className="p-3"
        alt={`${author}_${title}`}
        onClick={() => navigate(`/news/${id}`)}
      />
      <Card.Body className="d-flex flex-column align-items-center justify-content-end py-2" style={{ minHeight: '140px' }}>
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
  );
}

NewsItem.defaultProps = {
  id: null,
  author: null,
  title: null,
  image: null,
};

NewsItem.propTypes = newsType.isRequired;

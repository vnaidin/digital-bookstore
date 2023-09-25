import React, { useState } from 'react';
import {
  Col, ListGroup, ListGroupItem, Form,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDebounce, useSearch } from '../../utils/hooks';

export default function SearchBar() {
  const [search, updSearch] = useState('');
  const { t } = useTranslation();
  const debouncedSearch = useDebounce(search, 600);
  const value = useSearch(debouncedSearch);
  const navigate = useNavigate();

  return (
    <Col
      xs={12}
      sm={6}
      md={6}
      lg={5}
      xl={4}
      xxl={3}
      className="p-0 m-0"
    >
      <Form.Control
        size="lg"
        placeholder={t('layout.headerBottom.search.placeholder')}
        onChange={(e) => { updSearch(e.target.value); }}
        title="search"
        autoComplete="off"
        className="p-1"
        value={search}
      />

      {value && value.books.length > 0 && (
        <ListGroup
          style={{
            position: 'absolute', width: 'inherit', zIndex: '1',
          }}
          className="container-fluid px-0"
        >
            {value.books.map((result) => (
              <ListGroupItem
                key={result.id}
                style={{
                  position: 'relative', width: '100%',
                }}
                role="none"
                as="div"
                className="d-flex gap-2"
                onClick={() => { navigate(`/${result.itemType}/${result.id}`); updSearch(''); }}
              >
                <img src={result.image} width={15} alt={result.title} />
                {`${result.author} - ${result.title}`}
              </ListGroupItem>
            ))}
        </ListGroup>

      )}
    </Col>
  );
}

import React, { useRef, useState } from 'react';
import {
  Col, ListGroup, ListGroupItem, Form, InputGroup,
} from 'react-bootstrap';
import { BsSearch } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDebounce, useSearch } from '../../utils/hooks';

export default function SearchBar() {
  const [search, updSearch] = useState('');
  const { t } = useTranslation();
  const debouncedSearch = useDebounce(search, 600);
  const value = useSearch(debouncedSearch);
  const navigate = useNavigate();
  const serachRef = useRef();
  return (
    <Col
      xs={12}
      sm={9}
      md={6}
      lg={7}
      xl={8}
      xxl={8}
      className="p-0 m-0"
    >

      <InputGroup>
        <InputGroup.Text>
          <BsSearch size={20} onClick={() => serachRef.current.focus()} />
        </InputGroup.Text>
        <Form.Control
          size="lg"
          placeholder={t('layout.headerBottom.search.placeholder')}
          onChange={(e) => { updSearch(e.target.value); }}
          title="search"
          autoComplete="off"
          className="px-3"
          value={search}
          ref={serachRef}
        />
      </InputGroup>
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
                <img
                  src={`${import.meta.env.REACT_APP_BE_URL}/${result.image}`}
                  width={35}
                  alt={result.title}
                />
                {`${result.author.split(',').length > 1 ? `${result.author.split(',')[0]} ${t('layout.headerBottom.search.and-others')}` : result.author} - ${result.title}`}
              </ListGroupItem>
            ))}
        </ListGroup>

      )}
    </Col>
  );
}

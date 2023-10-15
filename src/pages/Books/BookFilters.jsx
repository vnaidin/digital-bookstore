import React, { useRef } from 'react';
import {
  Form, Row, Accordion, Button, InputGroup,
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import { MdClear } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import { BOOK_LANGUAGES } from '../../utils/constants';
import PriceRangeComponent from '../../components/PriceRange';
import { useFetch } from '../../utils/hooks';

export default function BookFilters({ // TODO: add delete btn in input
  minMaxPrice, updFilter, resetStartPage, resetFilters,
}) {
  const url = new URL(`${process.env.REACT_APP_BE_URL}/api/all/books`);
  const { /*  loading, error, */ value } = useFetch(
    url,
    {},
    [],
  );
  // console.log(value?.authors);
  const uniqueAuthorArray = Array.from(new Set(value?.authors.map((a) => {
    if (a.includes(',')) {
      return a.trim().split(', ').map((x) => x.trim());
    } return a.trimStart();
  }).flat()));

  const { t } = useTranslation();
  const authorRef = useRef();
  const languageRef = useRef();
  const publisherRef = useRef();

  const largeScreenView = (
    <>
      <Row className="gap-3 mt-3 mb-1" key="price-filter">
        <PriceRangeComponent
          resetStartPage={resetStartPage}
          minMaxPrice={minMaxPrice}
          updFilter={updFilter}
        />
      </Row>

      <Row className="my-1" key="auth-label">
        <Form.Label>
          {t('pages.books.book-filters.author')}
          :
          {' '}
        </Form.Label>
        <InputGroup>
          <Form.Control
            type="text"
            placeholder={t('pages.books.book-filters.author')}
            list="authors"
            ref={authorRef}
            onChange={(event) => {
              if (uniqueAuthorArray.some((auth) => event.target.value === auth)) {
                updFilter('author', event.target.value);
                resetStartPage();
              } else if (event.target.value.length === 0) {
                updFilter('author', null);
              }
            }}
          />
          <InputGroup.Text
            id="basic-addon2"
            className="p-1"
            onClick={() => { authorRef.current.value = ''; updFilter('author', null); }}
          >
            <MdClear size={10} />
          </InputGroup.Text>
        </InputGroup>
        <datalist id="authors">
          {uniqueAuthorArray.map((author) => (
            <label
              htmlFor={author}
              className="checkbox__label"
              key={author}
            >
              {author}
              <option
                aria-label={author}
                value={author}
              />
            </label>
          ))}
        </datalist>
      </Row>

      <Row className="my-1" key="language-filter">
        <Form.Label>
          {t('pages.books.book-filters.language')}
          :
          {' '}
        </Form.Label>
        <InputGroup>
          <Form.Control
            type="text"
            placeholder={t('pages.books.book-filters.language')}
            list="language"
            ref={languageRef}
            onChange={(event) => {
              if (BOOK_LANGUAGES.some((language) => event.target.value === language)) {
                updFilter('language', event.target.value);
                resetStartPage();
              } else if (event.target.value.length === 0) {
                updFilter('language', null);
              }
            }}
          />
          <InputGroup.Text
            id="basic-addon2"
            className="p-1"
            onClick={() => { languageRef.current.value = ''; updFilter('language', null); }}
          >
            <MdClear size={10} />
          </InputGroup.Text>
        </InputGroup>
        <datalist id="language">
          {BOOK_LANGUAGES.map((lang) => (
            <label
              htmlFor={lang}
              className="checkbox__label"
              key={lang}
            >
              {lang}
              <option
                aria-label={lang}
                value={lang}
              />
            </label>
          ))}
        </datalist>
      </Row>

      <Row className="my-1" key="publisher-filter">
        <Form.Label>
          {t('pages.books.book-filters.publisher')}
          :
          {' '}
        </Form.Label>
        <InputGroup>
          <Form.Control
            type="text"
            placeholder={t('pages.books.book-filters.publisher')}
            list="publishers"
            ref={publisherRef}
            onChange={(event) => {
              if (value?.publishers.some((publisher) => event.target.value === publisher)) {
                updFilter('publisher', event.target.value);
                resetStartPage();
              } else if (event.target.value.length === 0) {
                updFilter('publisher', null);
              }
            }}
          />
          <InputGroup.Text
            id="basic-addon2"
            className="p-1"
            onClick={() => { publisherRef.current.value = ''; updFilter('publisher', null); }}
          >
            <MdClear size={10} />
          </InputGroup.Text>
        </InputGroup>
        <datalist id="publishers">
          {value?.publishers && value?.publishers.map((publ) => (
            <label
              htmlFor="opt-publ"
              className="checkbox__label"
              key={publ}
            >
              {publ}
              <option
                aria-label="opt-publ"
                value={publ}
              />
            </label>
          ))}
        </datalist>
      </Row>
      <Button
        onClick={resetFilters}
        className="button my-2"
        style={{ fontWeight: '900' }}
      >
        {t('pages.books.book-filters.reset-filters')}
      </Button>
    </>
  );

  return window.innerWidth > 768 ? largeScreenView : (
    <Accordion className="my-2">
      <Accordion.Item eventKey="0">
        <Accordion.Header>{t('pages.books.book-filters.title')}</Accordion.Header>
        <Accordion.Body as={Row} className="gap-1 p-1 m-0 justify-content-center">
          {largeScreenView}
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
}

BookFilters.defaultProps = {
  minMaxPrice: [50, 1000],
};

BookFilters.propTypes = {
  updFilter: PropTypes.func.isRequired,
  resetStartPage: PropTypes.func.isRequired,
  resetFilters: PropTypes.func.isRequired,
  minMaxPrice: PropTypes.arrayOf(PropTypes.number),
};

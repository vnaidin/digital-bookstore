import React, { useState, useContext } from 'react';
import {
  Container, Row, Col, Card, Form, Modal, Button, Accordion,
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { FiUpload } from 'react-icons/fi';
import AppContext from '../../appContext';
import BookService from '../../services/book';
import {
  BOOK_CATEGORIES, BOOK_COVER_TYPES, BOOK_LANGUAGES, BOOK_TAGS,
} from '../../utils/constants';
import { bookType } from '../../utils/types';

export default function CreateUpdateBookModal({
  handleCloseModal, existingBook, authors, publishers,
}) {
  const [image, setImage] = useState(null);
  const [formData, setFormData] = useState({
    ...existingBook,
    category: existingBook?.category.length > 0 ? Array.from(existingBook?.category.split(',')).map((cat) => Number(cat)) : [],
    tags: existingBook?.tags.length > 0 ? Array.from(existingBook?.tags.split(',')).map((tag) => Number(tag)) : [],
  });

  const { t } = useTranslation();
  const { dispatch } = useContext(AppContext);

  const handleChange = (event) => setFormData((prev) => ({
    ...prev,
    [event.target.title]: event.target.value,
  }));

  const handleSubmit = (event) => {
    event.preventDefault();
    // everything is filled
    if (/* image && */ formData) {
      const fd = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        fd.append(key, value);
        console.log(key, value);
      });
      fd.append('image', image);
      // if (image) { fd.append('image', image); }

      if (existingBook?.id && existingBook?.id > 0) {
        // perform edit
        BookService.editBook(existingBook.id, fd).then(
          (response) => {
            /* console.log(response); */ handleCloseModal();
            dispatch({ type: 'setToast', payload: { body: response.data.message, callee: t('toasts.callee-sys') } });
          },
        ).catch((err) => {
          dispatch({ type: 'setToast', payload: { body: new Error(err).message, callee: t('toasts.callee-sys') } });
          console.error(new Error(err).message);
        });
      } else {
        // creating
        BookService.createBook(fd).then(
          (response) => {
            /* console.log(response); */ handleCloseModal();
            dispatch({ type: 'setToast', payload: { body: response.data.message, callee: t('toasts.callee-sys') } });
          },
        ).catch((err) => {
          dispatch({ type: 'setToast', payload: { body: new Error(err).message, callee: t('toasts.callee-sys') } });
          console.error(new Error(err).message);
        });
      }
    } else {
      // no image no formdata
      dispatch({
        type: 'setToast',
        payload: {
          body: t('basic.toasts.6'),
          callee: t('pages.create-nft.btns.create-nft'),
        },
      });
    }
  };

  return (
    <Modal
      show
      onHide={handleCloseModal}
      backdrop="static"
      keyboard={false}
      size="xl"
      fullscreen="md-down"
    >
      <Modal.Header closeButton>
        <Modal.Title>{existingBook?.id ? t('pages.moderator.tabs.book.modal.update') : t('pages.moderator.tabs.book.modal.create')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Row className="mb-3">
            <Col
              xs={12}
              sm={8}
              lg={8}
              xl={8}
              xxl={8}
            >
              <Form.Group
                as="form"
                controlId="form-grid"
                name="book-description-inputs"
                title="book-description-inputs"
                className="d-flex flex-column gap-1"
                onSubmit={handleSubmit}
              >
                <Form.Label>{t('pages.moderator.tabs.book.modal.author')}</Form.Label>
                <Form.Control
                  size="sm"
                  placeholder={t('pages.moderator.tabs.book.modal.author')}
                  onChange={handleChange}
                  list="authors"
                  title="author"
                  autoComplete="off"
                  defaultValue={existingBook?.author || ''}
                  required
                />
                <datalist id="authors">
                  {authors && authors.map((author) => (
                    <label
                      htmlFor="opt"
                      className="checkbox__label"
                      key={author}
                    >
                      {author}
                      <option
                        aria-label="opt"
                        value={author}
                      />
                    </label>
                  ))}
                </datalist>

                <Form.Label>{t('pages.moderator.tabs.book.modal.title')}</Form.Label>
                <Form.Control
                  size="sm"
                  placeholder={t('pages.moderator.tabs.book.modal.title')}
                  onChange={handleChange}
                  title="title"
                  autoComplete="off"
                  defaultValue={existingBook?.title || ''}
                  required
                />

                <Row>
                  <Form.Group
                    as={Col}
                    md="6"
                    controlId="validationFormik151"
                    className="position-relative"
                  >
                    <Form.Label>{t('pages.moderator.tabs.book.modal.publisher')}</Form.Label>
                    <Form.Control
                      size="sm"
                      placeholder={t('pages.moderator.tabs.book.modal.publisher')}
                      onChange={handleChange}
                      title="publisher"
                      list="publishers"
                      // autoComplete="off"
                      defaultValue={existingBook?.publisher || ''}
                      required
                    />
                    <datalist id="publishers">
                      {publishers && publishers.map((publisher) => (
                        <label
                          htmlFor="opt"
                          className="checkbox__label"
                          key={publisher}
                        >
                          {publisher}
                          <option
                            aria-label="opt"
                            value={publisher}
                          />
                        </label>
                      ))}
                    </datalist>
                  </Form.Group>

                  <Form.Group
                    as={Col}
                    md="2"
                    controlId="validationFormik151"
                    className="position-relative"
                  >
                    <Form.Label>{t('pages.moderator.tabs.book.modal.year')}</Form.Label>
                    <Form.Control
                      size="sm"
                      placeholder={t('pages.moderator.tabs.book.modal.year')}
                      type="number"
                      onChange={handleChange}
                      title="year"
                      list="year"
                      autoComplete="off"
                      // autoComplete="off"
                      defaultValue={existingBook?.year || null}
                      required
                    />
                    <datalist id="year">
                      {[2017, 2018, 2019, 2020, 2021, 2022, 2023].map((year) => (
                        <label
                          htmlFor="opt"
                          className="checkbox__label"
                          key={year}
                        >
                          {year}
                          <option
                            aria-label="opt"
                            value={year}
                          />
                        </label>
                      ))}
                    </datalist>
                  </Form.Group>

                  <Form.Group
                    as={Col}
                    md="4"
                    controlId="validationFormik151"
                    className="position-relative"
                  >
                    <Form.Label>ISBN</Form.Label>
                    <Form.Control
                      size="sm"
                      placeholder="ISBN"
                      type="number"
                      onChange={handleChange}
                      title="isbn"
                      autoComplete="off"
                      defaultValue={existingBook?.isbn || ''}
                      required
                    />
                  </Form.Group>
                </Row>
                <Row className="align-items-center">

                  <Form.Group
                    as={Col}
                    md="4"
                    controlId="validationFormik151"
                    className="position-relative"
                  >
                    <Form.Label>{t('pages.moderator.tabs.book.modal.pgCount')}</Form.Label>
                    <Form.Control
                      size="sm"
                      placeholder={t('pages.moderator.tabs.book.modal.pgCount')}
                      type="number"
                      onChange={handleChange}
                      title="pageCount"
                      autoComplete="off"
                      defaultValue={existingBook?.pageCount || null}
                      required
                    />
                  </Form.Group>

                  <Form.Group
                    as={Col}
                    md="4"
                    controlId="validationFormik151"
                    className="position-relative"
                  >
                    <Form.Label>{t('pages.moderator.tabs.book.modal.cover')}</Form.Label>

                    <Form.Select
                      size="sm"
                      placeholder={t('pages.moderator.tabs.book.modal.cover')}
                      onChange={handleChange}
                      title="coverType"
                      list="cover"
                      autoComplete="off"
                      defaultValue={existingBook?.coverType || ''}
                      required
                    >
                      <option hidden value={null}>none</option>
                      {BOOK_COVER_TYPES.map(
                        (collection, ind) => (
                          <option
                            key={t(`constants.coverTypes.${ind}`)}
                            value={ind}
                          >
                            {t(`constants.coverTypes.${ind}`)}
                          </option>
                        ),
                      )}
                    </Form.Select>
                  </Form.Group>

                  <Form.Group
                    as={Col}
                    md="4"
                    controlId="validationFormik151"
                    className="position-relative"
                  >
                    <Form.Label>{t('pages.moderator.tabs.book.modal.lang')}</Form.Label>
                    <Form.Control
                      size="sm"
                      placeholder={t('pages.moderator.tabs.book.modal.lang')}
                      onChange={handleChange}
                      title="lang"
                      list="language"
                      autoComplete="off"
                      defaultValue={existingBook?.lang || ''}
                      required
                    />
                    <datalist id="language">
                      {BOOK_LANGUAGES.map((lang) => (
                        <label
                          htmlFor="opt"
                          className="checkbox__label"
                          key={lang}
                        >
                          {lang}
                          <option
                            aria-label="opt"
                            value={lang}
                          />
                        </label>
                      ))}
                    </datalist>
                  </Form.Group>

                  <Form.Group
                    as={Col}
                    md="12"
                    controlId="validationFormik151"
                    className="position-relative"
                  >
                    <Form.Label>{t('pages.moderator.tabs.book.modal.category')}</Form.Label>
                    <div>
                      <Accordion>
                        <Accordion.Item eventKey="0">
                          <Accordion.Header>{t('pages.moderator.tabs.book.modal.category')}</Accordion.Header>
                          <Accordion.Body as={Row} className="gap-1">
                            {BOOK_CATEGORIES.map((category) => (
                              <Form.Check
                                className="col md-3"
                                key={category.id}
                                style={{ border: '1px solid black' }}
                                type="checkbox"
                                label={t(`constants.bookCategories.${category.id}`)}
                                value={category.id}
                                checked={new Set(formData.category).has(category.id)}
                                // required
                                onChange={(event) => {
                                  if (event.target.checked) {
                                    setFormData((prev) => ({
                                      ...prev,
                                      category: prev.category?.concat(+event.target.value),
                                    }));
                                  } else {
                                    const temp = [...formData.category];
                                    const indToRemove = temp.findIndex(
                                      (x) => x === +event.target.value,
                                    );
                                    temp.splice(indToRemove, 1);
                                    setFormData((prev) => ({ ...prev, category: temp }));
                                  }
                                }}
                              />
                            ))}
                          </Accordion.Body>
                        </Accordion.Item>
                      </Accordion>

                    </div>
                  </Form.Group>

                </Row>
                <Row className="align-items-center">

                  <Form.Group
                    as={Col}
                    md="4"
                    controlId="validationFormik151"
                    className="position-relative"
                  >
                    <Form.Label>{t('pages.moderator.tabs.book.modal.price')}</Form.Label>
                    <Form.Control
                      size="sm"
                      placeholder={t('pages.moderator.tabs.book.modal.price')}
                      type="number"
                      onChange={handleChange}
                      title="price"
                      autoComplete="off"
                      defaultValue={existingBook?.price || null}
                      required
                    />
                  </Form.Group>
                  <Form.Group
                    as={Col}
                    md="4"
                    controlId="validationFormik151"
                    className="position-relative"
                  >
                    <Form.Label>{t('pages.moderator.tabs.book.modal.red-price')}</Form.Label>
                    <Form.Control
                      size="sm"
                      placeholder={t('pages.moderator.tabs.book.modal.red-price')}
                      type="number"
                      onChange={handleChange}
                      title="reducedPrice"
                      autoComplete="off"
                      defaultValue={existingBook?.reducedPrice !== null
                        ? existingBook?.reducedPrice : 0}
                    />
                  </Form.Group>

                  <Form.Group
                    as={Col}
                    md="4"
                    controlId="validationFormik151"
                    className="position-relative"
                  >
                    <Form.Label>{t('pages.moderator.tabs.book.modal.isReduced')}</Form.Label>
                    <Form.Select
                      onChange={handleChange}
                      title="isReducedNow"
                      // eslint-disable-next-line no-unsafe-optional-chaining
                      defaultValue={+existingBook?.isReducedNow || false}
                      required
                    >
                      <option value={0}>No</option>
                      <option value={1}>Yes</option>
                    </Form.Select>
                  </Form.Group>
                </Row>

                <Form.Label>{t('pages.moderator.tabs.book.modal.annotation')}</Form.Label>
                <Form.Control
                  size="sm"
                  as="textarea"
                  placeholder={t('pages.moderator.tabs.book.modal.annotation')}
                  maxLength={2000}
                  onChange={handleChange}
                  title="annotation"
                  defaultValue={existingBook?.annotation || ''}
                  rows={8}
                  required
                />
                <Form.Group
                  as={Col}
                  md="12"
                  controlId="validationFormik151"
                  className="position-relative"
                >
                  <Form.Label>{t('pages.moderator.tabs.book.modal.tags')}</Form.Label>
                  <div>
                    <Accordion>
                      <Accordion.Item eventKey="0">
                        <Accordion.Header>{t('pages.moderator.tabs.book.modal.tags')}</Accordion.Header>
                        <Accordion.Body as={Row} className="gap-1">
                          {BOOK_TAGS.map((tag, ind) => (
                            <Form.Check
                              className="col md-3"
                              key={tag}
                              style={{ border: '1px solid black' }}
                              type="checkbox"
                              label={tag}
                              value={ind}
                              checked={new Set(formData.tags).has(ind)}
                                // required
                              onChange={(event) => {
                                if (event.target.checked) {
                                  setFormData((prev) => ({
                                    ...prev,
                                    tags: prev.tags?.concat(+event.target.value),
                                  }));
                                } else {
                                  const temp = [...formData.tags];
                                  const indToRemove = temp.findIndex(
                                    (x) => x === +event.target.value,
                                  );
                                  temp.splice(indToRemove, 1);
                                  setFormData((prev) => ({ ...prev, tags: temp }));
                                }
                              }}
                            />
                          ))}
                        </Accordion.Body>
                      </Accordion.Item>
                    </Accordion>

                  </div>
                </Form.Group>
                <hr />
                <Row>
                  <Form.Group
                    as={Col}
                    md="6"
                    controlId="validationFormik151"
                    className="position-relative"
                  >
                    <Form.Label>{t('pages.moderator.tabs.book.modal.amount')}</Form.Label>
                    <Form.Control
                      size="sm"
                      placeholder={t('pages.moderator.tabs.book.modal.amount')}
                      type="number"
                      onChange={handleChange}
                      title="amount"
                      autoComplete="off"
                      defaultValue={existingBook?.item_management?.amount !== null
                        ? existingBook?.item_management?.amount : 0}
                      required
                    />
                  </Form.Group>

                  <Form.Group
                    as={Col}
                    md="6"
                    controlId="validationFormik151"
                    className="position-relative"
                  >
                    {' '}
                    <Form.Label>{t('pages.moderator.tabs.book.modal.comments')}</Form.Label>
                    <Form.Control
                      size="sm"
                      as="textarea"
                      placeholder={t('pages.moderator.tabs.book.modal.comments')}
                      maxLength={2000}
                      onChange={handleChange}
                      title="comments"
                      defaultValue={existingBook?.item_management?.comments || ''}
                      rows={5}
                    />
                  </Form.Group>
                </Row>

                <Button
                  className="m-2 place-self-center"
                  type="submit"
                  style={{ backgroundColor: '#05aac2', fontWeight: '900' }}

                >
                  {existingBook?.id ? t('pages.moderator.tabs.book.modal.update') : t('pages.moderator.tabs.book.modal.create')}
                </Button>
              </Form.Group>
            </Col>

            <Card
              // bg={variant}
              as={Col}
              // xs={12}
              xs={{ order: 'first' }}
              sm={4}
              lg={4}
              xl={4}
              xxl={4}
              style={{ border: 'none', backgroundColor: '#E0E0E0' }}
              className="align-items-center"
            >

              {(image || existingBook?.image) && (
                <Card.Img
                  variant="top"
                  src={image ? URL.createObjectURL(image)
                    : `${existingBook?.image ? '' : process.env.REACT_APP_BE_URL}${existingBook.image}`}
                />
              )}
              <Card.Body>
                <Form.Group
                  controlId="formFile"
                >
                  <Form.Label
                    className="p-2"
                    style={{
                      backgroundColor: '#515151',
                      color: 'white',
                      borderRadius: '24px',
                    }}
                  >
                    <FiUpload size={20} className="mx-1" />
                  </Form.Label>
                  <Form.Control
                    type="file"
                    // id="img"
                    accept="image/*"
                    size="sm"
                    style={{ display: 'none' }}
                    onChange={(e) => setImage(e.target.files[0])}
                  />
                </Form.Group>
              </Card.Body>

            </Card>
          </Row>

        </Container>
      </Modal.Body>
    </Modal>

  );
}

CreateUpdateBookModal.defaultProps = {
  existingBook: {
    id: null,
    author: null,
    title: null,
    // image: null,
    publisher: null,
    year: null,
    isbn: null,
    pageCount: null,
    lang: null,
    price: null,
    reducedPrice: 0,
    isReducedNow: false,
    annotation: null,
    category: '',
    tags: '',
  },
  authors: null,
  publishers: null,
};

CreateUpdateBookModal.propTypes = {
  handleCloseModal: PropTypes.func.isRequired,
  existingBook: bookType,
  authors: PropTypes.arrayOf(PropTypes.string),
  publishers: PropTypes.arrayOf(PropTypes.string),
};

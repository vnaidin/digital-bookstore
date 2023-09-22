/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useContext } from 'react';
import {
  Container, Row, Col, Card, Form, Modal, Button, Accordion,
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { FiUpload } from 'react-icons/fi';
import AppContext from '../../appContext';
import BookService from '../../services/book';
import { BOOK_CATEGORIES, BOOK_COVER_TYPES, BOOK_TAGS } from '../../utils/constants';
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
      });
      fd.append('image', image);
      // if (image) { fd.append('image', image); }

      if (existingBook?.id && existingBook?.id > 0) {
        // perform edit
        BookService.editBook(existingBook.id, fd).then(
          (response) => {
            /* console.log(response); */ handleCloseModal();
            dispatch({ type: 'setToast', payload: { body: response.data.message, callee: 'System' } });
          },
        ).catch((err) => {
          dispatch({ type: 'setToast', payload: { body: new Error(err).message, callee: 'System' } });
          console.error(new Error(err).message);
        });
      } else {
        // creating
        BookService.createBook(fd).then(
          (response) => {
            /* console.log(response); */ handleCloseModal();
            dispatch({ type: 'setToast', payload: { body: response.data.message, callee: 'System' } });
          },
        ).catch((err) => {
          dispatch({ type: 'setToast', payload: { body: new Error(err).message, callee: 'System' } });
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
        <Modal.Title>{existingBook?.id ? 'Update' : 'Create'}</Modal.Title>
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
                <Form.Label>Author</Form.Label>
                <Form.Control
                  size="sm"
                  placeholder="Author"
                  onChange={handleChange}
                  list="authors"
                  title="author"
                  autoComplete="off"
                  defaultValue={existingBook?.author || ''}
                  required
                />
                <datalist id="authors">
                  {authors && authors.map((author) => (
                    <option value={author} key={author} />
                  ))}
                </datalist>

                <Form.Label>Title</Form.Label>
                <Form.Control
                  size="sm"
                  placeholder="Title"
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
                    <Form.Label>Publisher</Form.Label>
                    <Form.Control
                      size="sm"
                      placeholder="Publisher"
                      onChange={handleChange}
                      title="publisher"
                      list="publishers"
                      // autoComplete="off"
                      defaultValue={existingBook?.publisher || ''}
                      required
                    />
                    <datalist id="publishers">
                      {publishers && publishers.map((author) => (
                        <option value={author} key={author} />
                      ))}
                    </datalist>
                  </Form.Group>

                  <Form.Group
                    as={Col}
                    md="2"
                    controlId="validationFormik151"
                    className="position-relative"
                  >
                    <Form.Label>Year</Form.Label>
                    <Form.Control
                      size="sm"
                      placeholder="Year"
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
                      {[2017, 2018, 2019, 2020, 2021, 2022, 2023].map((author) => (
                        <option value={author} key={author} />
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
                    <Form.Label>Page count</Form.Label>
                    <Form.Control
                      size="sm"
                      placeholder="PageCount"
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
                    <Form.Label>Cover</Form.Label>

                    <Form.Select
                      size="sm"
                      placeholder="cover"
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
                            key={collection}
                            value={ind}
                          >
                            {collection}
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
                    <Form.Label>Language</Form.Label>
                    <Form.Control
                      size="sm"
                      placeholder="Language"
                      onChange={handleChange}
                      title="lang"
                      list="language"
                      autoComplete="off"
                      defaultValue={existingBook?.lang || ''}
                      required
                    />
                    <datalist id="language">
                      {['українська', 'english'].map((author) => (
                        <option value={author} key={author} />
                      ))}
                    </datalist>
                  </Form.Group>

                  <Form.Group
                    as={Col}
                    md="12"
                    controlId="validationFormik151"
                    className="position-relative"
                  >
                    <Form.Label>Category</Form.Label>
                    <div>
                      <Accordion>
                        <Accordion.Item eventKey="0">
                          <Accordion.Header>Categories</Accordion.Header>
                          <Accordion.Body as={Row} className="gap-1">
                            {BOOK_CATEGORIES.map((category, ind) => (
                              <Form.Check
                                className="col md-3"
                                key={category}
                                style={{ border: '1px solid black' }}
                                type="checkbox"
                                label={category}
                                value={ind}
                                checked={new Set(formData.category).has(ind)}
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
                    <Form.Label>Price</Form.Label>
                    <Form.Control
                      size="sm"
                      placeholder="Price"
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
                    <Form.Label>Reduced Price</Form.Label>
                    <Form.Control
                      size="sm"
                      placeholder="ReducedPrice"
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
                    <Form.Label>isReducedNow</Form.Label>
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

                <Form.Label>Annotation</Form.Label>
                <Form.Control
                  size="sm"
                  as="textarea"
                  placeholder="Annotation"
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
                  <Form.Label>Tags</Form.Label>
                  <div>
                    <Accordion>
                      <Accordion.Item eventKey="0">
                        <Accordion.Header>Tags</Accordion.Header>
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
                    <Form.Label>Amount</Form.Label>
                    <Form.Control
                      size="sm"
                      placeholder="Amount"
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
                    <Form.Label>Comments</Form.Label>
                    <Form.Control
                      size="sm"
                      as="textarea"
                      placeholder="Comments"
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
                >
                  {existingBook?.id ? 'Update' : 'Create'}
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

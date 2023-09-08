import React, { useState, useContext } from 'react';
import {
  Container, Row, Col, Card, Form, Modal, Button,
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import AppContext from '../../appContext';
import BookService from '../../services/book';

export default function CreateUpdateBookModal({ handleCloseModal, existingBook }) {
  const [image, setImage] = useState();
  const {
    id,
    author,
    title,
    publisher,
    year,
    isbn,
    pageCount,
    lang,
    price,
    reducedPrice,
    isReducedNow,
    annotation,
    category,
    tags,
  } = existingBook;
  const [formData, setFormData] = useState({
    id,
    author,
    title,
    publisher,
    year,
    isbn,
    pageCount,
    lang,
    price,
    reducedPrice,
    isReducedNow,
    annotation,
    category,
    tags,
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
      if (image) { fd.append('image', image); }

      if (existingBook.id) {
        // perform edit
        BookService.editBook(existingBook.id, fd).then(
          (response) => {
            /* console.log(response); */ handleCloseModal();
            dispatch({ type: 'setToast', payload: { body: response.data.message, callee: 'System' } });
          },
        ).catch((err) => console.error(new Error(err).message));
      } else {
        // creating
        BookService.createBook(fd).then(
          (response) => {
            /* console.log(response); */ handleCloseModal();
            dispatch({ type: 'setToast', payload: { body: response.data.message, callee: 'System' } });
          },
        ).catch((err) => console.error(new Error(err).message));
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
        <Modal.Title>{existingBook.id ? 'Update' : 'Create'}</Modal.Title>
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
                // encType="multipart/form-data"
              >
                {/* <Form.Label>Email address</Form.Label> */}
                <Form.Control
                  size="sm"
                  placeholder="Author"
                  onChange={handleChange}
                  // title="author"
                  autoComplete="off"
                  defaultValue={existingBook?.author || ''}
                  required
                />

                <Form.Control
                  size="sm"
                  placeholder="Title"
                  onChange={handleChange}
                  title="title"
                  autoComplete="off"
                  defaultValue={existingBook?.title || ''}
                  required
                />

                <Form.Control
                  size="sm"
                  placeholder="Publisher"
                  onChange={handleChange}
                  title="publisher"
                  // autoComplete="off"
                  defaultValue={existingBook?.publisher || ''}
                  required
                />

                <Form.Control
                  size="sm"
                  placeholder="Year"
                  type="number"
                  onChange={handleChange}
                  title="year"
                  // autoComplete="off"
                  defaultValue={existingBook?.year || null}
                  required
                />

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

                <Form.Control
                  size="sm"
                  placeholder="Language"
                  onChange={handleChange}
                  title="lang"
                  // autoComplete="off"
                  defaultValue={existingBook?.lang || ''}
                  required
                />

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

                <Form.Select
                  onChange={handleChange}
                  title="isReducedNow"
                  // eslint-disable-next-line no-unsafe-optional-chaining
                  defaultValue={+existingBook?.isReducedNow || false}
                >
                  <option value={0}>No</option>
                  <option value={1}>Yes</option>
                </Form.Select>

                <Form.Control
                  size="sm"
                  as="textarea"
                  placeholder="Annotation"
                  maxLength={2000}
                  onChange={handleChange}
                  title="annotation"
                  defaultValue={existingBook?.annotation || ''}
                  rows={10}
                  required
                />

                <Form.Select
                  aria-label="collection-select"
                  onChange={handleChange}
                  title="category"
                  placeholder="Category"
                  defaultValue={existingBook?.category || null}
                  required
                >
                  <option hidden value={null}>none</option>
                  {['military'].map(
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

                <Form.Control
                  placeholder="Tags"
                  type="string"
                  onChange={handleChange}
                  title="tags"
                  autoComplete="off"
                  defaultValue={existingBook?.tags || ''}
                />

                <Button
                  className="m-2 place-self-center"
                  type="submit"
                >
                  {existingBook.id ? 'Update' : 'Create'}
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
                  src={image ? URL.createObjectURL(image) : existingBook.image}
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
                    <img height={30} src="/assets/upload-icon.svg" alt="upload" />
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
    category: null,
    tags: null,
  },
};

CreateUpdateBookModal.propTypes = {
  handleCloseModal: PropTypes.func.isRequired,
  existingBook: PropTypes.shape({
    id: PropTypes.number,
    author: PropTypes.string,
    title: PropTypes.string,
    image: PropTypes.string,
    publisher: PropTypes.string,
    year: PropTypes.number,
    isbn: PropTypes.string,
    pageCount: PropTypes.number,
    lang: PropTypes.string,
    price: PropTypes.number,
    reducedPrice: PropTypes.number,
    isReducedNow: PropTypes.bool,
    annotation: PropTypes.string,
    category: PropTypes.string,
    tags: PropTypes.string,
  }),
};

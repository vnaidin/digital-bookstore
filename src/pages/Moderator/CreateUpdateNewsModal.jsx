import React, { useState, useContext } from 'react';
import {
  Container, Row, Col, Card, Form, Modal, Button,
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { FiUpload } from 'react-icons/fi';
import AppContext from '../../appContext';
import NewsService from '../../services/news';
import { newsType } from '../../utils/types';

export default function CreateUpdateNewsModal({
  handleCloseModal, existingNews,
}) {
  const [image, setImage] = useState(null);
  const [formData, setFormData] = useState({
    ...existingNews,
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

      if (existingNews?.id && existingNews?.id > 0) {
        // perform edit
        NewsService.editNews(existingNews.id, fd).then(
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
        NewsService.createNews(fd).then(
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
          body: t('layout.toasts.6'),
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
        <Modal.Title>{existingNews?.id ? t('pages.moderator.tabs.news.modal.update') : t('pages.moderator.tabs.news.modal.create')}</Modal.Title>
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
                <Form.Label>{t('pages.moderator.tabs.news.modal.author')}</Form.Label>
                <Form.Control
                  size="sm"
                  placeholder={t('pages.moderator.tabs.news.modal.author')}
                  onChange={handleChange}
                  list="authors"
                  title="author"
                  autoComplete="off"
                  defaultValue={existingNews?.author || ''}
                  required
                />
                {/* <datalist id="authors">
                  {authors && authors.map((author) => (
                    <option value={author} key={author} />
                  ))}
                </datalist> */}

                <Form.Label>{t('pages.moderator.tabs.news.modal.title')}</Form.Label>
                <Form.Control
                  size="sm"
                  placeholder={t('pages.moderator.tabs.news.modal.title')}
                  onChange={handleChange}
                  title="title"
                  autoComplete="off"
                  defaultValue={existingNews?.title || ''}
                  required
                />

                <Row>
                  <Form.Group
                    as={Col}
                    md="4"
                    controlId="validationFormik151"
                    className="position-relative"
                  >
                    <Form.Label>{t('pages.moderator.tabs.news.modal.category')}</Form.Label>
                    <Form.Control
                      size="sm"
                      placeholder={t('pages.moderator.tabs.news.modal.category')}
                      onChange={handleChange}
                      title="category"
                      // autoComplete="off"
                      defaultValue={existingNews?.publisher || ''}
                      required
                    />
                  </Form.Group>
                  <Form.Group
                    as={Col}
                    md="6"
                    controlId="validationFormik151"
                    className="position-relative"
                  >
                    <Form.Label>{t('pages.moderator.tabs.news.modal.showImg')}</Form.Label>
                    <Form.Select
                      onChange={handleChange}
                      title={t('pages.moderator.tabs.news.modal.showImg')}
                      // eslint-disable-next-line no-unsafe-optional-chaining
                      defaultValue={+existingNews?.showImage || false}
                      required
                    >
                      <option value={0}>No</option>
                      <option value={1}>Yes</option>
                    </Form.Select>
                  </Form.Group>
                </Row>

                <Form.Label>{t('pages.moderator.tabs.news.modal.text')}</Form.Label>
                <Form.Control
                  size="sm"
                  as="textarea"
                  placeholder={t('pages.moderator.tabs.news.modal.text')}
                  maxLength={5000}
                  onChange={handleChange}
                  title="text"
                  defaultValue={existingNews?.text || ''}
                  rows={8}
                  required
                />

                <Button
                  className="m-2 place-self-center"
                  type="submit"
                  style={{ backgroundColor: '#05aac2', fontWeight: '900' }}

                >
                  {existingNews?.id ? t('pages.moderator.tabs.news.modal.update') : t('pages.moderator.tabs.news.modal.create')}
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

              {(image || existingNews?.image) && (
                <Card.Img
                  variant="top"
                  src={image ? URL.createObjectURL(image)
                    : `${existingNews?.image ? '' : process.env.REACT_APP_BE_URL}${existingNews.image}`}
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

CreateUpdateNewsModal.defaultProps = {
  existingNews: {
    id: null,
    author: null,
    title: null,
    // image: null,
    publisher: null,
    showImage: false,
    text: null,
  },
};

CreateUpdateNewsModal.propTypes = {
  handleCloseModal: PropTypes.func.isRequired,
  existingNews: newsType,
};

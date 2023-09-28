/* eslint-disable no-unused-vars */
import React, { useContext, useState } from 'react';
import {
  Button, Container, Table, Row,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useFetch } from '../../utils/hooks';
import NewsService from '../../services/news';
import CreateUpdateNewsModal from './CreateUpdateNewsModal';
import AppContext from '../../appContext';

export default function NewsTab() {
  const { dispatch } = useContext(AppContext);
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const [currentNews, updateBookObject] = useState();

  const handleCloseModal = () => { setShowModal(false); updateBookObject(null); };
  const handleOpenModal = () => setShowModal(true);

  const { loading, error, value } = useFetch(
    `${process.env.REACT_APP_BE_URL}/api/all/news`,
    {},
    [showModal],
  );
  const handleBookDelete = (id) => {
    NewsService.deleteNews(id).then((response) => {
      dispatch({ type: 'setToast', payload: { body: response.data.message, callee: t('toasts.callee-sys') } });
      console.warn('refetch');
    });// FIXME: refetch
  };
  const handleBookUpdate = (id) => {
    handleOpenModal(); updateBookObject(value.news.find((book) => book.id === id));
  };
  return (
    <>
      {showModal && (
      <CreateUpdateNewsModal
        existingNews={currentNews}
        handleCloseModal={handleCloseModal}
      />
      )}
      <Container>
        <Row className="my-3">
          <Button variant="success" onClick={handleOpenModal}>{t('pages.moderator.tabs.news.create')}</Button>
        </Row>
        <Table
          /* striped */
          bordered
          hover
          responsive
        >
          <thead>
            <tr>
              <th>#</th>
              <th>{t('pages.moderator.tabs.news.table.author')}</th>
              <th>{t('pages.moderator.tabs.news.table.title')}</th>
              <th>{t('pages.moderator.tabs.news.table.publisher')}</th>
              <th>{t('pages.moderator.tabs.news.table.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {value && value.news.map(({
              id, author, title, image, publisher, text,
            }) => (
              <tr key={id}>
                <td>{id}</td>
                <td>{author}</td>
                <td>{title}</td>
                <td>{publisher}</td>
                <td className="d-flex gap-1">
                  <Button variant="danger" onClick={() => handleBookDelete(id)}>{t('pages.moderator.tabs.news.remove')}</Button>
                  <Button variant="warning" onClick={() => { handleBookUpdate(id); }}>{t('pages.moderator.tabs.news.update')}</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

      </Container>
    </>
  );
}

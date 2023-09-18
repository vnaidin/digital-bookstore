/* eslint-disable no-unused-vars */
import React, { useContext, useState } from 'react';
import {
  Button, Container, Table, Row,
} from 'react-bootstrap';
import { useFetch } from '../../utils/hooks';
import BookService from '../../services/book';
import CreateUpdateBookModal from './CreateUpdateBookModal';
import AppContext from '../../appContext';

export default function BooksTab() {
  const { dispatch } = useContext(AppContext);
  const [showModal, setShowModal] = useState(false);
  const [currentBook, updateBookObject] = useState();

  const handleCloseModal = () => { setShowModal(false); updateBookObject(null); };
  const handleOpenModal = () => setShowModal(true);

  const { loading, error, value } = useFetch(
    `${process.env.REACT_APP_BE_URL}/all/books`,
    {},
    [showModal],
  );
  const handleBookDelete = (id) => {
    BookService.deleteBook(id).then((response) => {
      dispatch({ type: 'setToast', payload: { body: response.data.message, callee: 'System' } });
      handleCloseModal();
    });// FIXME: refetch
  };
  const handleBookUpdate = (id) => {
    handleOpenModal(); updateBookObject(value.books.find((book) => book.id === id));
  };
  return (
    <>
      {showModal && (
      <CreateUpdateBookModal
        existingBook={currentBook}
        handleCloseModal={handleCloseModal}
        authors={value?.authors}
        publishers={value?.publishers}
      />
      )}
      <Container>
        <Row className="my-3">
          <Button variant="success" onClick={handleOpenModal}>Create Book</Button>
        </Row>
        <Table
          striped
          bordered
          hover
          responsive
        >
          <thead>
            <tr>
              <th>#</th>
              <th>Author_Title</th>
              <th>ISBN</th>
              <th>Price</th>
              <th>Reduced_Price</th>
              <th>Is Reduced</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {value && value.books.map(({
              id, author, title, image, publisher, year, isbn,
              pageCount, lang, price, reducedPrice, isReducedNow, annotation,
            }, index) => (
              <tr key={id}>
                <td>{index + 1}</td>
                <td>{`${author}_${title}`}</td>
                <td>{isbn}</td>
                <td>{price}</td>
                <td>{reducedPrice}</td>
                <td>{isReducedNow.toString()}</td>
                <td className="d-flex gap-1">
                  <Button variant="danger" onClick={() => handleBookDelete(id)}>Remove</Button>
                  <Button variant="warning" onClick={() => { handleBookUpdate(id); }}>Update</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

      </Container>
    </>
  );
}

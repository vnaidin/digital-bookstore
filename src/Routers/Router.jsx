import React, { lazy, useContext } from 'react';
import {
  Container,
} from 'react-bootstrap';
import {
  BrowserRouter as Router, Routes, Route,
} from 'react-router-dom';
import Header from '../layout/Header';
import HeaderBottom from '../layout/HeaderBottom';
import Main from '../pages/MainPage';
import AppContext from '../appContext';

const Delivery = lazy(() => import('../pages/Delivery'));
const Authors = lazy(() => import('../pages/Authors'));
const Order = lazy(() => import('../pages/Order'));
const AboutUs = lazy(() => import('../pages/AboutUs'));
const Contacts = lazy(() => import('../pages/Contacts'));
const Retrieval = lazy(() => import('../pages/Retrieval'));
const TermsOfUse = lazy(() => import('../pages/TermsOfUse'));
const Moderator = lazy(() => import('../pages/Moderator'));
const BookPage = lazy(() => import('../pages/BookPage'));
const PageNotFound = lazy(() => import('../pages/404'));
// const Merch = lazy(() => import('../pages/Merch'));

export default function AppRouter() {
  const { state } = useContext(AppContext);
  return (
    <Router>
      <Header />
      <HeaderBottom />
      <Container as="main">
        <Routes>
          <Route index path="/" element={<Main />} />
          <Route path="/authors" element={<Authors />} />
          <Route path="/book/:id" element={<BookPage />} />
          <Route path="/delivery" element={<Delivery />} />
          {/* <Route path="/merch" element={<Merch />} /> */}
          {/* <Route path="/merch/:id" element={<BookPage />} /> */}
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<Contacts />} />
          <Route path="/retrieval" element={<Retrieval />} />
          <Route path="/order" element={<Order />} />
          <Route path="/terms" element={<TermsOfUse />} />
          {state?.currentUser?.roles.some((role) => role === 'ROLE_MODERATOR')
          && <Route path="/moderator" element={<Moderator />} />}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Container>
    </Router>
  );
}

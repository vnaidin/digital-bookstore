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
// const Authors = lazy(() => import('../pages/Authors'));
const Order = lazy(() => import('../pages/Order'));
const AboutUs = lazy(() => import('../pages/AboutUs'));
const Contacts = lazy(() => import('../pages/Contacts'));
const TermsOfUse = lazy(() => import('../pages/TermsOfUse'));
const Moderator = lazy(() => import('../pages/Moderator'));
const BookPage = lazy(() => import('../pages/BookPage'));
const MerchPage = lazy(() => import('../pages/MerchPage'));
const PassReset = lazy(() => import('../pages/PassReset'));
const News = lazy(() => import('../pages/News'));
const NewsPage = lazy(() => import('../pages/NewsPage'));
const OrderPage = lazy(() => import('../pages/OrderPage'));
const PageNotFound = lazy(() => import('../pages/404'));
const Merch = lazy(() => import('../pages/Merch'));

export default function AppRouter() {
  const { state } = useContext(AppContext);
  return (
    <Router>
      <Header />
      <HeaderBottom />
      <Container as="main">
        <Routes>
          <Route index path="/" element={<Main />} />
          {/* <Route path="/authors" element={<Authors />} /> */}
          <Route path="/book/:id" element={<BookPage />} />
          <Route path="/news" element={<News />} />
          <Route path="/news/:id" element={<NewsPage />} />
          <Route path="/delivery" element={<Delivery />} />
          <Route path="/merch" element={<Merch />} />
          <Route path="/merch/:id" element={<MerchPage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<Contacts />} />
          <Route path="/order" element={<Order />} />
          <Route path="/order/:id" element={<OrderPage />} />
          <Route path="/terms" element={<TermsOfUse />} />
          {state?.currentUser?.roles.some((role) => role === 'ROLE_SELLER')
          && <Route path="/moderator" element={<Moderator />} />}
          <Route path="/passwordReset" element={<PassReset />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Container>
    </Router>
  );
}

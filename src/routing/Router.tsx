import { lazy } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, Route, Routes } from 'react-router-dom';

import Main from '@/pages/MainPage';
import { useAppSelector } from '@/store';
import { selectIsModerator, selectIsSeller } from '@/store/user';

import LocaleLayout from './LocaleLayout';

const Books = lazy(() => import('@/pages/Books'));
const BookPage = lazy(() => import('@/pages/Books/BookPage'));
const News = lazy(() => import('@/pages/News'));
const NewsPage = lazy(() => import('@/pages/News/NewsPage'));
const Merch = lazy(() => import('@/pages/Merch'));
const MerchPage = lazy(() => import('@/pages/Merch/MerchPage'));
const Order = lazy(() => import('@/pages/Order'));
const OrderPage = lazy(() => import('@/pages/Order/OrderPage'));
const AboutUs = lazy(() => import('@/pages/AboutUs'));
const Contacts = lazy(() => import('@/pages/Contacts'));
const TermsOfUse = lazy(() => import('@/pages/TermsOfUse'));
const Moderator = lazy(() => import('@/pages/Moderator'));
const PassReset = lazy(() => import('@/pages/PassReset'));
const PageNotFound = lazy(() => import('@/pages/404'));

function LangRedirect() {
  const { i18n } = useTranslation();
  const raw = i18n.language;
  const lang = raw.startsWith('en') ? 'en' : 'uk';
  return <Navigate to={`/${lang}/`} replace />;
}

export default function AppRouter() {
  const isSeller = useAppSelector(selectIsSeller);
  const isModOrAdmin = useAppSelector(selectIsModerator);
  const canAccessModerator = isSeller || isModOrAdmin;

  return (
    <main style={{ padding: '0 1rem' }}>
      <Routes>
        <Route path="/" element={<LangRedirect />} />
        <Route path="/:lang" element={<LocaleLayout />}>
          <Route index element={<Main />} />
          <Route path="books" element={<Books />} />
          <Route path="book/:id" element={<BookPage />} />
          <Route path="news" element={<News />} />
          <Route path="news/:id" element={<NewsPage />} />
          <Route path="merch" element={<Merch />} />
          <Route path="merch/:id" element={<MerchPage />} />
          <Route path="about" element={<AboutUs />} />
          <Route path="contact" element={<Contacts />} />
          <Route path="order" element={<Order />} />
          <Route path="order/:id" element={<OrderPage />} />
          <Route path="terms" element={<TermsOfUse />} />
          {canAccessModerator && <Route path="moderator" element={<Moderator />} />}
          <Route path="passwordReset" element={<PassReset />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
        <Route path="*" element={<LangRedirect />} />
      </Routes>
    </main>
  );
}

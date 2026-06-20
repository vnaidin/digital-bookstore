import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

import Main from '@/pages/MainPage';
import { useAppSelector } from '@/store';

const Order = lazy(() => import('@/pages/Order'));
const Books = lazy(() => import('@/pages/Books'));
const AboutUs = lazy(() => import('@/pages/AboutUs'));
const Contacts = lazy(() => import('@/pages/Contacts'));
const TermsOfUse = lazy(() => import('@/pages/TermsOfUse'));
const Moderator = lazy(() => import('@/pages/Moderator'));
const BookPage = lazy(() => import('@/pages/BookPage'));
const MerchPage = lazy(() => import('@/pages/MerchPage'));
const PassReset = lazy(() => import('@/pages/PassReset'));
const News = lazy(() => import('@/pages/News'));
const NewsPage = lazy(() => import('@/pages/NewsPage'));
const OrderPage = lazy(() => import('@/pages/OrderPage'));
const PageNotFound = lazy(() => import('@/pages/404'));
const Merch = lazy(() => import('@/pages/Merch'));

export default function AppRouter() {
  const user = useAppSelector((s) => s.user);
  const canAccessModerator = user?.roles.some((role) =>
    ['ROLE_SELLER', 'ROLE_MODERATOR', 'ROLE_ADMIN'].includes(role)
  );

  return (
    <main style={{ padding: '0 1rem' }}>
      <Routes>
        <Route index path="/" element={<Main />} />
        <Route path="/books" element={<Books />} />
        <Route path="/book/:id" element={<BookPage />} />
        <Route path="/news" element={<News />} />
        <Route path="/news/:id" element={<NewsPage />} />
        <Route path="/merch" element={<Merch />} />
        <Route path="/merch/:id" element={<MerchPage />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<Contacts />} />
        <Route path="/order" element={<Order />} />
        <Route path="/order/:id" element={<OrderPage />} />
        <Route path="/terms" element={<TermsOfUse />} />
        {canAccessModerator && <Route path="/moderator" element={<Moderator />} />}
        <Route path="/passwordReset" element={<PassReset />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </main>
  );
}

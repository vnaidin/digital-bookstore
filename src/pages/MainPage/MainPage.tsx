import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Carousel } from '@mantine/carousel';
import { Container, SimpleGrid, Title } from '@mantine/core';
import { useInterval } from '@mantine/hooks';

import { ItemCard, NewsItem, NoDataComponent, Page } from '@/components';
import { useGetBooksQuery, useGetMerchQuery, useGetNewsQuery } from '@/store/api';
import { Book, Merch, NewsArticle as NewsArticleType } from '@/types';

import './index.css';

export default function Main() {
  const { t } = useTranslation();
  const [embla, setEmbla] = useState<{ scrollNext: () => void } | null>(null);

  const { data: booksData } = useGetBooksQuery({});
  const { data: merchData } = useGetMerchQuery({});
  const { data: newsData } = useGetNewsQuery({});

  const { start, stop } = useInterval(() => embla?.scrollNext(), 3000);
  useEffect(() => {
    if (embla) { start(); return stop; }
  }, [embla]);

  const featuredBooks: Book[] = booksData?.books.filter((b) => b.tags).slice(0, 24) ?? [];
  const hasData = (booksData?.books.length ?? 0) + (merchData?.merch.length ?? 0) + (newsData?.news.length ?? 0) > 0;

  return (
    <Container fluid py="xl" px="md">
      <Page title={t('pages.mainPage.title')} description={t('pages.mainPage.description')} />

      {newsData && newsData.news.length > 0 && <Title order={3} mb="xs">{t('pages.mainPage.news')}</Title>}
      <SimpleGrid cols={{ base: 1, xs: 2, sm: 3, lg: 4 }} mb="md">
        {newsData?.news.map((item: NewsArticleType) => (
          <NewsItem key={item.id} {...item} />
        ))}
      </SimpleGrid>

      {booksData && booksData.books.length > 0 && <Title order={3} mb="xs">{t('pages.mainPage.books')}</Title>}
      {featuredBooks.length > 0 && (
        <Carousel
          getEmblaApi={setEmbla}
          onMouseEnter={stop}
          onMouseLeave={start}
          withControls
          slideSize={{ base: '100%', xs: '50%', sm: '33.333%', lg: '25%' }}
          slideGap="sm"
          emblaOptions={{ loop: true, align: 'start' }}
          withIndicators={false}
          mb="md"
        >
          {featuredBooks.map((book: Book) => (
            <Carousel.Slide key={book.id}>
              <ItemCard {...book} imageHeight={300} />
            </Carousel.Slide>
          ))}
        </Carousel>
      )}

      {merchData && merchData.merch.length > 0 && <Title order={3} mb="xs">{t('pages.mainPage.merch')}</Title>}
      <SimpleGrid cols={{ base: 1, xs: 2, sm: 3, lg: 4 }} mb="md">
        {merchData?.merch.map((item: Merch) => (
          <ItemCard key={item.id} {...item} imageHeight={250} />
        ))}
      </SimpleGrid>

      {!hasData && <NoDataComponent />}
    </Container>
  );
}

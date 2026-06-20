import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Carousel } from '@mantine/carousel';
import { Container, Title } from '@mantine/core';
import { useInterval } from '@mantine/hooks';

import { ItemCard, NewsItem, NoDataComponent } from '@/components';
import { useGetBooksQuery, useGetMerchQuery, useGetNewsQuery } from '@/store/api';
import { chunkArray } from '@/utils/helpers';

import './index.css';

function defineChunkSize(width: number) {
  if (width < 576) return 1;
  if (width < 992) return 2;
  if (width < 1400) return 3;
  return 4;
}

export default function Main() {
  const { t } = useTranslation();
  const [embla, setEmbla] = useState<any>(null);

  const { data: booksData } = useGetBooksQuery({});
  const { data: merchData } = useGetMerchQuery({});
  const { data: newsData } = useGetNewsQuery({});

  const { start, stop } = useInterval(() => embla?.scrollNext(), 3000);
  useEffect(() => {
    if (embla) { start(); return stop; }
  }, [embla]);

  const chunkSize = defineChunkSize(window.innerWidth);
  const featuredBooks = booksData?.books.filter((b: any) => b.tags).slice(0, 24) ?? [];
  const chunks = chunkArray(featuredBooks, chunkSize);

  const hasData = (booksData?.books.length ?? 0) + (merchData?.merch.length ?? 0) + (newsData?.news.length ?? 0) > 0;

  return (
    <Container fluid py="xl" px={0}>
      <title>{t('pages.mainPage.title')}</title>

      {newsData && newsData.news.length > 0 && <Title order={3} mb="xs">{t('pages.mainPage.news')}</Title>}
      <div style={{ display: 'flex', overflowX: 'auto', gap: 8, paddingBlock: '1em' }}>
        {newsData?.news.map((item: any) => (
          <div key={item.id} style={{ minWidth: 260 }}>
            <NewsItem {...item} />
          </div>
        ))}
      </div>

      {booksData && booksData.books.length > 0 && <Title order={3} mb="xs">{t('pages.mainPage.books')}</Title>}
      {chunks.length > 0 && (
        <Carousel
          getEmblaApi={setEmbla}
          onMouseEnter={stop}
          onMouseLeave={start}
          withControls
          loop
          withIndicators={false}
          mb="md"
        >
          {chunks.map((booksChunk: any[]) => (
            <Carousel.Slide key={booksChunk[0]?.id}>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', paddingInline: '4em' }}>
                {booksChunk.map((book) => (
                  <div key={book.id} style={{ flex: '0 0 auto', width: `${100 / chunkSize}%` }}>
                    <ItemCard {...book} imageHeight={300} />
                  </div>
                ))}
              </div>
            </Carousel.Slide>
          ))}
        </Carousel>
      )}

      {merchData && merchData.merch.length > 0 && <Title order={3} mb="xs">{t('pages.mainPage.merch')}</Title>}
      <div style={{ display: 'flex', overflowX: 'auto', gap: 8, paddingBlock: '1em', flexWrap: 'wrap' }}>
        {merchData?.merch.map((item: any) => (
          <div key={item.id} style={{ minWidth: 200 }}>
            <ItemCard {...item} imageHeight={250} />
          </div>
        ))}
      </div>

      {!hasData && <NoDataComponent />}
    </Container>
  );
}

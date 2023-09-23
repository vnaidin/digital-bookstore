import {
  shape, /*  func, */ string, number, bool,
} from 'prop-types';

export const bookType = shape({
  id: number,
  author: string,
  title: string,
  image: string,
  publisher: string,
  year: number,
  isbn: string,
  pageCount: number,
  coverType: number,
  lang: string,
  price: number,
  reducedPrice: number,
  isReducedNow: bool,
  annotation: string,
  category: string,
  tags: string,
  item_management: shape({
    amount: number,
    comments: string,
  }),
});

export const merchType = shape({
  id: number,
  title: string,
  image: string,
  price: number,
  reducedPrice: number,
  isReducedNow: bool,
  annotation: string,
  tags: string,
  item_management: shape({
    amount: number,
    comments: string,
  }),
});

export const newsType = shape({
  id: number,
  author: string,
  title: string,
  image: string,
  publisher: string,
  text: string,
  showImage: bool,
  item_management: shape({
    amount: number,
    comments: string,
  }),
});

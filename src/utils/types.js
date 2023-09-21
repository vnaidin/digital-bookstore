/* eslint-disable import/prefer-default-export */
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

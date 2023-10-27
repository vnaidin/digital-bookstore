import {
  shape, /*  func, */ string, number, bool, arrayOf,
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

export const promoCodeType = shape({
  id: number,
  name: string,
  percent: number,
  from: string,
  till: string,
  updatedAt: string,
});

export const orderType = shape({
  id: number,
  name: string,
  surname: string,
  phoneNumber: string,
  receiverName: string,
  receiverSurname: string,
  receiverPhoneNumber: string,
  email: string,
  order_address: shape({
    delMethodId: number,
    city: string,
    street: string,
    houseNr: string,
    flatNr: number,
    branch: number,
  }),
  comments: string,
  promocode: string,
  price: number,
  status: number,
  hasPaid: bool,
  createdAt: string,
  order_items: arrayOf(shape({
    itemId: number,
    price: number,
  })),
});

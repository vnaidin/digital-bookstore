export const DELIVERY_METHODS = [
  {
    id: 1, title: 'УкрПошта Експрес (доставка до відділення)', freeFrom: 1500, stateFullAddress: false,
  },
  {
    id: 2, title: 'Нова Пошта. Відділення', freeFrom: 1500, stateFullAddress: false,
  },
  {
    id: 3, title: 'Нова Пошта. Поштомати', freeFrom: 1500, stateFullAddress: false,
  },
  {
    id: 4, title: 'Нова Пошта. Кур\'єр', freeFrom: 1500, stateFullAddress: true,
  },
  {
    id: 5, title: 'Meest Пошта. Відділення / міні-відділення', freeFrom: 1500, stateFullAddress: false,
  },
  {
    id: 6, title: 'Meest Пошта. Кур\'єр', freeFrom: 1500, stateFullAddress: true,
  }];

export const ORDER_STATUSES = ['new', 'inProgress', 'finished'];

export const PAYMENT_METHODS = ['cash', 'liqpay'];

export const BOOK_CATEGORIES = [
  'Action and adventure',
  'Art/architecture',
  'Alternate history',
  'Autobiography',
  'Anthology',
  'Biography',
  'Chick lit',
  'Business/economics',
  "Children's",
  'Crafts/hobbies',
  'Classic',
  'Cookbook',
  'Comic book',
  'Diary',
  'Coming-of-age',
  'Dictionary',
  'Crime',
  'Encyclopedia',
  'Drama',
  'Guide',
  'Fairytale',
];

export const BOOK_ORDERING = [{ title: 'Price high>low', value: 'price,DESC' }, { title: 'Price low>high', value: 'price,ASC' }];

export const BOOK_COVER_TYPES = ['Мʼяка', 'Тверда'];

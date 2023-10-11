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

export const ORDER_STATUSES = {
  0: { title: 'Новий' }, 1: { title: 'В обробці' }, 2: { title: 'Доставка' }, 3: { title: 'Завершений' }, 4: { title: 'Скасований' },
};

export const PAYMENT_METHODS = ['cash', 'liqpay'];

export const BOOK_LANGUAGES = ['українська', 'english'];

export const BOOK_CATEGORIES = [
  {
    id: 1,
    title: 'Художня література',
  },
  {
    id: 2,
    title: 'Нон-фікшн',
  },
  {
    id: 3,
    title: 'Військова література',
  },
  {
    id: 4,
    title: 'Воєнна література',
  },
  {
    id: 5,
    title: 'Детективи/триллери',
  },
  {
    id: 6,
    title: 'Фантастика/фентезі',
  },
  {
    id: 7,
    title: 'Науково-популярна література',
  },
  {
    id: 8,
    title: 'Підручники/посібники',
  },
  {
    id: 9,
    title: 'Дитяча література',
  },
  {
    id: 10,
    title: 'Підліткова література',
  },
  {
    id: 11,
    title: 'Біографії/мемуари',
  },
  {
    id: 12,
    title: 'Поезія',
  },
  {
    id: 13,
    title: 'Комікси',
  },
  {
    id: 14,
    title: 'Історична література',
  },
  {
    id: 15,
    title: 'Психологія',
  },
  {
    id: 16,
    title: 'Хроніки',
  },
  {
    id: 17,
    title: 'Ветеранська література',
  },
  {
    id: 18,
    title: 'Класична література',
  },
  {
    id: 19,
    title: 'Фотоальбоми/Артбуки',
  },
];

export const BOOK_ORDERING = [{ id: 0, value: 'price,DESC' }, { id: 1, value: 'price,ASC' }];

export const BOOK_COVER_TYPES = ['Мʼяка', 'Тверда'];

export const BOOK_TAGS = ['New', 'Top', 'Exclusive'];

export const BOOK_PUBLICATION_YEARS = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];

export const NEWS_CATEGORIES = [''];

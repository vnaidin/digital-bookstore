// eslint-disable-next-line import/prefer-default-export
export const DELIVERY_METHODS = [
  {
    id: 1, title: 'УкрПошта Експрес (доставка до відділення)', cost: 32, freeFrom: 300, stateFullAddress: false,
  },
  {
    id: 2, title: 'Нова Пошта. Відділення', cost: 60, freeFrom: 799, stateFullAddress: false,
  },
  {
    id: 3, title: 'Нова Пошта. Поштомати', cost: 32, freeFrom: null, stateFullAddress: false,
  },
  {
    id: 4, title: 'Нова Пошта. Кур\'єр', cost: 80, freeFrom: null, stateFullAddress: true,
  },
  {
    id: 5, title: 'Meest Пошта. Відділення / міні-відділення', cost: 40, freeFrom: null, stateFullAddress: false,
  },
  {
    id: 6, title: 'Meest Пошта. Кур\'єр', cost: 60, freeFrom: null, stateFullAddress: true,
  }];

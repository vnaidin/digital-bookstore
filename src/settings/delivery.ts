export const DELIVERY_METHODS = [
  { id: 1, title: 'УкрПошта Експрес (доставка до відділення)', freeFrom: 1500, stateFullAddress: false, trackUrl: 'https://track.ukrposhta.ua/tracking_UA.html?barcode=' },
  { id: 2, title: 'Нова Пошта. Відділення', freeFrom: 1500, stateFullAddress: false, trackUrl: 'https://novaposhta.ua/tracking/?cargo_number=' },
  { id: 3, title: 'Нова Пошта. Поштомати', freeFrom: 1500, stateFullAddress: false, trackUrl: 'https://novaposhta.ua/tracking/?cargo_number=' },
  { id: 4, title: "Нова Пошта. Кур'єр", freeFrom: 1500, stateFullAddress: true, trackUrl: 'https://novaposhta.ua/tracking/?cargo_number=' },
  { id: 5, title: 'Meest Пошта. Відділення / міні-відділення', freeFrom: 1500, stateFullAddress: false, trackUrl: 'https://www.meestpost.com/uk/tracking?trackingNumber=' },
  { id: 6, title: "Meest Пошта. Кур'єр", freeFrom: 1500, stateFullAddress: true, trackUrl: 'https://www.meestpost.com/uk/tracking?trackingNumber=' },
];

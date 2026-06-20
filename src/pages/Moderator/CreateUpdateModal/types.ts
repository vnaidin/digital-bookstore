import type { ChangeEvent } from 'react';

export type EntityType = 'book' | 'merch' | 'news';

export interface CatalogFormData {
  id?: number;
  author?: string;
  title?: string;
  publisher?: string;
  year?: number;
  isbn?: string;
  pageCount?: number;
  coverType?: number;
  lang?: string;
  price?: number;
  reducedPrice?: number;
  isReducedNow?: number;
  annotation?: string;
  text?: string;
  showImage?: number;
  amount?: number;
  comments?: string;
  category: number[];
  tags: number[];
}

export interface FormHandlers {
  formData: CatalogFormData;
  set: (key: keyof CatalogFormData) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  setNum: (key: keyof CatalogFormData) => (v: string | number) => void;
  toggleArrayItem: (field: 'category' | 'tags', id: number, checked: boolean) => void;
}

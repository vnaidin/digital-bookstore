export interface Book {
  id: number;
  title: string;
  author: string;
  publisher?: string;
  year?: number;
  isbn?: string;
  pageCount?: number;
  coverType?: number;
  lang?: string;
  price: number;
  reducedPrice: number;
  isReducedNow: boolean;
  image: string;
  covers?: string;
  tags?: string;
  category?: string;
  annotation?: string;
  itemType: string;
  item_management?: { amount: number; comments?: string };
}

export interface Merch {
  id: number;
  title: string;
  price: number;
  reducedPrice: number;
  isReducedNow: boolean;
  image: string;
  covers?: string;
  annotation?: string;
  itemType: string;
  item_management?: { amount: number; comments?: string };
}

export interface NewsArticle {
  id: number;
  title: string;
  author: string;
  publisher?: string;
  image: string;
  showImage?: boolean;
  text?: string;
  createdAt: string;
}

export interface BooksResponse {
  books: Book[];
  count: number;
  total: number;
  authors?: string[];
  publishers?: string[];
  minMaxPrice?: [number, number];
}

export interface MerchResponse {
  merch: Merch[];
  count: number;
  total: number;
  minMaxPrice?: [number, number];
}

export interface NewsResponse {
  news: NewsArticle[];
  count: number;
  total: number;
}

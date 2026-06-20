import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  id: number;
  price: number;
  title: string;
  image: string;
  reducedPrice: number;
  isReducedNow: boolean;
}

const cartSlice = createSlice({
  name: 'cart',
  initialState: (JSON.parse(localStorage.getItem('cart') ?? 'null') ?? []) as CartItem[],
  reducers: {
    setCart(_, action: PayloadAction<CartItem[]>) {
      localStorage.setItem('cart', JSON.stringify(action.payload));
      return action.payload;
    },
    addItem(state, action: PayloadAction<CartItem>) {
      const next = [...state, action.payload];
      localStorage.setItem('cart', JSON.stringify(next));
      return next;
    },
    removeOneItem(state, action: PayloadAction<number>) {
      const temp = [...state];
      const idx = temp.findIndex((x) => Number(x.id) === Number(action.payload));
      if (idx >= 0) temp.splice(idx, 1);
      localStorage.setItem('cart', JSON.stringify(temp));
      return temp;
    },
    clearCart() {
      localStorage.setItem('cart', '[]');
      return [];
    },
  },
});

export const { setCart, addItem, removeOneItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

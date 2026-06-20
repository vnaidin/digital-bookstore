import type { RootState } from '@/store';

export const selectCart = (state: RootState) => state.cart;
export const selectCartCount = (state: RootState) => state.cart.length;
export const selectCartTotal = (state: RootState) =>
  state.cart.reduce((sum, item) => sum + (item.isReducedNow ? item.reducedPrice : item.price), 0);
export const selectIsInCart = (id: number) => (state: RootState) =>
  state.cart.some((item) => Number(item.id) === Number(id));

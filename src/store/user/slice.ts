import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id: number;
  name?: string;
  surname?: string;
  email?: string;
  phoneNumber?: string;
  roles: string[];
  accessToken: string;
  wishlist?: string;
}

type UserState = User | null;

const userSlice = createSlice({
  name: 'user',
  initialState: (JSON.parse(localStorage.getItem('user') ?? 'null') ?? null) as UserState,
  reducers: {
    logIn(_, action: PayloadAction<User>) {
      localStorage.setItem('user', JSON.stringify(action.payload));
      return action.payload;
    },
    logOut() {
      localStorage.removeItem('user');
      return null;
    },
  },
});

export const { logIn, logOut } = userSlice.actions;
export default userSlice.reducer;

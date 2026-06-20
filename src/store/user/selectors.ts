import type { RootState } from '@/store';

export const selectUser = (state: RootState) => state.user;
export const selectUserId = (state: RootState) => state.user?.id;
export const selectUserRoles = (state: RootState) => state.user?.roles ?? [];
export const selectIsSeller = (state: RootState) =>
  state.user?.roles.some((r) => r === 'ROLE_SELLER') ?? false;
export const selectIsModerator = (state: RootState) =>
  state.user?.roles.some((r) => r === 'ROLE_MODERATOR' || r === 'ROLE_ADMIN') ?? false;
export const selectIsLoggedIn = (state: RootState) => state.user !== null;

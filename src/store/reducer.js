export const initialState = {
  toast: null/* { visible: 3, body: 'body', callee: 'system' } */,
  currentUser: JSON.parse(localStorage.getItem('user')) || undefined,
  shoppingCart: JSON.parse(localStorage.getItem('cart')) || [],
  wishList: localStorage.getItem('wishList') ? JSON.parse(localStorage.getItem('wishList')) : [],
};

export function reducer(state, action) {
  switch (action.type) {
    case 'logIn':
      return { ...state, currentUser: action.payload };
    case 'logOut':
      return { ...state, currentUser: undefined };

    case 'addItemToCart':
      return { ...state, shoppingCart: action.payload };
    case 'rmItemFromCart':
      return {
        ...state,
        shoppingCart: action.payload,
      };
    case 'clearCart':
      return { ...state, shoppingCart: [] };

    case 'addItemToWishList':
      return { ...state, wishList: action.payload };
    case 'rmItemFromWishList':
      return {
        ...state,
        wishList: action.payload,
      };

    case 'setDeliveryMethod': {
      return { ...state, deliveryMethod: action.payload };
    }

    case 'setToast':
      return { ...state, toast: action.payload };

    default:
      return state;
  }
}

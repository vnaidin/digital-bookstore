export const initialState = {
  toast: null/* { visible: 3, body: 'body', callee: 'syatem' } */,
  currentUser: JSON.parse(localStorage.getItem('user')) || undefined,
  shoppingCart: JSON.parse(localStorage.getItem('cart')) || [],
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

    case 'setDeliveryMethod': {
      return { ...state, deliveryMethod: action.payload };
    }

    case 'setToast':
      return { ...state, toast: action.payload };

    default:
      return state;
  }
}

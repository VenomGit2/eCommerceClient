export const cartInitialState = { items: [] };

export default function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const match = state.items.find((item) => item.id === action.payload.id);
      return { items: match
        ? state.items.map((item) => item.id === action.payload.id ? { ...item, quantity: item.quantity + 1 } : item)
        : [...state.items, { ...action.payload, quantity: 1 }] };
    }
    case 'QUANTITY': return { items: state.items.map((item) => item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item).filter((item) => item.quantity > 0) };
    case 'REMOVE': return { items: state.items.filter((item) => item.id !== action.payload) };
    case 'REPLACE': return { items: action.payload };
    case 'CLEAR': return cartInitialState;
    default: return state;
  }
}


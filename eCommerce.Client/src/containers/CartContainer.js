import { useCallback, useMemo, useReducer } from 'react';
import CartContext from '../context/CartContext';
import cartReducer, { cartInitialState } from '../globalStates/cartReducer';

export default function CartContainer({ children }) {
  const [state, dispatch] = useReducer(cartReducer, cartInitialState);
  const addItem = useCallback((item) => dispatch({ type: 'ADD', payload: item }), []);
  const setQuantity = useCallback((id, quantity) => dispatch({ type: 'QUANTITY', payload: { id, quantity } }), []);
  const removeItem = useCallback((id) => dispatch({ type: 'REMOVE', payload: id }), []);
  const clearCart = useCallback(() => dispatch({ type: 'CLEAR' }), []);
  const value = useMemo(() => ({
    ...state, addItem, setQuantity, removeItem, clearCart,
    itemCount: state.items.reduce((total, item) => total + item.quantity, 0),
    total: state.items.reduce((total, item) => total + (Number(item.price) || 0) * item.quantity, 0),
  }), [state, addItem, setQuantity, removeItem, clearCart]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

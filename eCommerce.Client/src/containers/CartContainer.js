import { useCallback, useMemo, useReducer } from 'react';
import CartContext from '../context/CartContext';
import cartReducer, { cartInitialState } from '../globalStates/cartReducer';
import useAuth from '../hooks/useAuth';
import { createCart, updateCart } from '../services/cartService';

export default function CartContainer({ children }) {
  const [state, dispatch] = useReducer(cartReducer, cartInitialState);
  const { session } = useAuth();
  const addItem = useCallback(async (item) => {
    const existingItem = state.items.find((cartItem) => cartItem.id === item.id);
    const items = existingItem
      ? state.items.map((cartItem) => cartItem.id === item.id
        ? { ...cartItem, quantity: cartItem.quantity + 1 }
        : cartItem)
      : [...state.items, { ...item, quantity: 1 }];

    const saveCart = state.items.length === 0 ? createCart : updateCart;
    await saveCart({ items }, session?.token);
    dispatch({ type: 'REPLACE', payload: items });
  }, [state.items, session?.token]);
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

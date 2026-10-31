import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import CartContext from '../context/CartContext';
import cartReducer from '../globalStates/cartReducer';
import { readCartSnapshot, writeCartSnapshot } from '../utils/cartRecovery';

export default function CartContainer({ children }) {
  const initialSnapshot = useRef(null);
  if (initialSnapshot.current === null) initialSnapshot.current = readCartSnapshot();
  const [state, dispatch] = useReducer(cartReducer, { items: initialSnapshot.current.items });
  const [recovery, setRecovery] = useState(initialSnapshot.current.recovery);
  useEffect(() => writeCartSnapshot(state.items), [state.items]);
  const addItem = useCallback((item) => dispatch({ type: 'ADD', payload: item }), []);
  const setQuantity = useCallback((id, quantity) => dispatch({ type: 'QUANTITY', payload: { id, quantity } }), []);
  const removeItem = useCallback((id) => dispatch({ type: 'REMOVE', payload: id }), []);
  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR' });
    setRecovery(null);
  }, []);
  const dismissRecovery = useCallback(() => setRecovery(null), []);
  const value = useMemo(() => ({
    ...state, recovery, addItem, setQuantity, removeItem, clearCart, dismissRecovery,
    itemCount: state.items.reduce((total, item) => total + item.quantity, 0),
    total: state.items.reduce((total, item) => total + (Number(item.price) || 0) * item.quantity, 0),
  }), [state, recovery, addItem, setQuantity, removeItem, clearCart, dismissRecovery]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

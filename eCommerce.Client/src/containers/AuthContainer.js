import { useCallback, useMemo, useReducer } from 'react';
import AuthContext from '../context/AuthContext';
import authReducer, { authInitialState } from '../globalStates/authReducer';
import * as authService from '../services/authService';
import { readAuthSession, writeAuthSession } from '../utils/storage';

export default function AuthContainer({ children }) {
  const [state, dispatch] = useReducer(authReducer, { ...authInitialState, session: readAuthSession() });
  const sessionUser = state.session?.data?.data ?? state.session?.data ?? state.session;

  const runAuth = useCallback(async (operation, payload) => {
    dispatch({ type: 'START' });
    try {
      const session = await operation(payload);
      writeAuthSession(session);
      dispatch({ type: 'SUCCESS', payload: session });
      return session;
    } catch (error) {
      dispatch({ type: 'FAILURE', payload: error.message });
      throw error;
    }
  }, []);

  const logout = useCallback(() => { writeAuthSession(null); dispatch({ type: 'LOGOUT' }); }, []);
  const register = useCallback(async (details) => {
    dispatch({ type: 'START' });
    try {
      const response = await authService.register(details);
      dispatch({ type: 'COMPLETE' });
      return response;
    } catch (error) {
      dispatch({ type: 'FAILURE', payload: error.message });
      throw error;
    }
  }, []);
  const value = useMemo(() => ({
    ...state,
    isAuthenticated: Boolean(state.session),
    isAdmin: state.session?.isAdmin === true || state.session?.roles?.includes?.('Admin'),
    isSuperadmin: state.session?.isSuperAdmin === true
      || state.session?.isSuperadmin === true
      || sessionUser?.isSuperAdmin === true
      || sessionUser?.isSuperadmin === true,
    login: (credentials) => runAuth(authService.login, credentials),
    register,
    logout,
  }), [state, runAuth, register, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

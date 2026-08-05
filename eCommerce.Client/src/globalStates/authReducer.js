export const authInitialState = { session: null, status: 'idle', error: null };

export default function authReducer(state, action) {
  switch (action.type) {
    case 'RESTORE': return { ...state, session: action.payload };
    case 'START': return { ...state, status: 'loading', error: null };
    case 'SUCCESS': return { session: action.payload, status: 'success', error: null };
    case 'COMPLETE': return { ...state, status: 'success', error: null };
    case 'FAILURE': return { ...state, status: 'error', error: action.payload };
    case 'LOGOUT': return authInitialState;
    default: return state;
  }
}

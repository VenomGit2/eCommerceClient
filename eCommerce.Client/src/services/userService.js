import { endpointPath } from '../hooks/useAxios';
const path = () => endpointPath('REACT_APP_USERS_PATH');
export async function getCurrentUser(API, signal) {
  const { data } = await API.get(path(), { signal });
  return data;
}
export async function updateCurrentUser(API, user) {
  const { data } = await API.put(path(), user);
  return data;
}

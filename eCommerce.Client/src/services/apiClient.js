import { getAxiosInstance } from '../hooks/useAxios';

function requireConfiguration(value, name) {
  if (!value) throw new Error(`${name} is not configured.`);
  return value;
}

export async function apiRequest(path, options = {}) {
  const { headers, body, signal, ...requestOptions } = options;
  delete requestOptions.token;
  const resourcePath = requireConfiguration(path, 'API endpoint path');
  const response = await getAxiosInstance().request({
    ...requestOptions,
    url: resourcePath.replace(/^\//, ''),
    signal,
    headers: {
      ...headers,
    },
    data: body,
  });
  return response.data;
}

export function endpointPath(variableName, suffix = '') {
  return `${requireConfiguration(process.env[variableName], variableName)}${suffix}`;
}

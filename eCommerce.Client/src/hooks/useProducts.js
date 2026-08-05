import useAsync from './useAsync';
import { getProducts } from '../services/productService';
import { getCollection } from '../utils/apiResponse';

export default function useProducts() {
  const result = useAsync((signal) => getProducts(signal), []);
  return { ...result, products: getCollection(result.data) };
}


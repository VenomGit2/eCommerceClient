import useAsync from './useAsync';
import useAxios from './useAxios';
import { getProducts } from '../services/productService';
import { getCollection } from '../utils/apiResponse';

export default function useProducts() {
  const API = useAxios();
  const result = useAsync((signal) => getProducts(API, signal), [API]);
  return { ...result, products: getCollection(result.data) };
}

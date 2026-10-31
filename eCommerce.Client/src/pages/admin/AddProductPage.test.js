import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import AddProductPage from './AddProductPage';
import { generateProductDescription } from '../../services/aiService';
import { createProduct } from '../../services/productService';

jest.mock('./AdminProductTabs', () => () => null);
jest.mock('../../hooks/useAxios', () => () => ({}));
jest.mock('../../services/aiService', () => ({ generateProductDescription: jest.fn() }));
jest.mock('../../services/productService', () => ({ createProduct: jest.fn() }));

describe('AddProductPage', () => {
  beforeEach(() => {
    URL.createObjectURL = jest.fn(() => 'blob:test-product');
    URL.revokeObjectURL = jest.fn();
    generateProductDescription.mockReset();
    createProduct.mockReset();
    createProduct.mockResolvedValue({});
  });

  const fillProduct = () => {
    fireEvent.change(screen.getByLabelText('Product name'), { target: { value: 'Desk lamp' } });
    fireEvent.change(screen.getByLabelText('Unit price'), { target: { value: '99' } });
    fireEvent.change(screen.getByLabelText('Quantity in stock'), { target: { value: '2' } });
    fireEvent.change(screen.getByLabelText('Product image'), {
      target: { files: [new File(['image'], 'lamp.png', { type: 'image/png' })] },
    });
  };

  it('generates a description on submit when the admin leaves it blank', async () => {
    generateProductDescription.mockResolvedValue('A desk lamp for everyday use.');
    render(<AddProductPage />);
    fillProduct();

    fireEvent.click(screen.getByRole('button', { name: 'Add product' }));

    await waitFor(() => expect(createProduct).toHaveBeenCalledTimes(1));
    expect(generateProductDescription).toHaveBeenCalledWith(
      expect.any(Object),
      { productName: 'Desk lamp', category: 'Other' },
    );
    expect(createProduct.mock.calls[0][1]).toMatchObject({ description: 'A desk lamp for everyday use.' });
  });

  it('keeps a description supplied by the admin', async () => {
    render(<AddProductPage />);
    fillProduct();
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Handmade by our team.' } });

    fireEvent.click(screen.getByRole('button', { name: 'Add product' }));

    await waitFor(() => expect(createProduct).toHaveBeenCalledTimes(1));
    expect(generateProductDescription).not.toHaveBeenCalled();
    expect(createProduct.mock.calls[0][1]).toMatchObject({ description: 'Handmade by our team.' });
  });

  it('does not create the product if generation fails', async () => {
    generateProductDescription.mockRejectedValue(new Error('AI service unavailable.'));
    render(<AddProductPage />);
    fillProduct();

    fireEvent.click(screen.getByRole('button', { name: 'Add product' }));

    expect(await screen.findByText('AI service unavailable.')).toBeTruthy();
    expect(createProduct).not.toHaveBeenCalled();
  });
});

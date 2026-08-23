import { getPage } from './apiResponse';

describe('getPage', () => {
  test('normalizes a legacy collection response', () => {
    const response = { success: true, data: [{ id: 1 }, { id: 2 }] };

    expect(getPage(response)).toEqual({
      items: response.data,
      pageNumber: 1,
      pageSize: 2,
      totalItems: 2,
      totalPages: 1,
      hasMore: false,
    });
  });

  test('preserves server pagination metadata', () => {
    const items = [{ id: 101 }];
    const response = {
      success: true,
      data: {
        items,
        pageNumber: 2,
        pageSize: 100,
        totalItems: 201,
        totalPages: 3,
        hasMore: true,
      },
    };

    expect(getPage(response)).toEqual({
      items,
      pageNumber: 2,
      pageSize: 100,
      totalItems: 201,
      totalPages: 3,
      hasMore: true,
    });
  });
});

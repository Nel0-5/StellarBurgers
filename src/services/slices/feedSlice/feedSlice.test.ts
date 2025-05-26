import feed, { getFeedsThunk, getOrderByNumberThunk } from './feedSlice';
import { TOrder } from '../../../utils/types';

describe('Редьюсер ленты заказов', () => {
  const initialState = {
    orders: [],
    isFeedsLoading: false,
    order: null,
    isOrderLoading: false,
    total: 0,
    totalToday: 0,
    error: null
  };

  const mockOrder: TOrder = {
    _id: '1',
    ingredients: ['60d3b41abdacab0026a733c6', '60d3b41abdacab0026a733cc'],
    status: 'done',
    name: 'Space флюоресцентный бургер',
    createdAt: '2023-05-25T12:00:00.000Z',
    updatedAt: '2023-05-25T12:00:00.000Z',
    number: 12345
  };

  const mockFeedResponse = {
    orders: [mockOrder],
    total: 100,
    totalToday: 10
  };

  const mockOrderResponse = {
    orders: [mockOrder]
  };

  describe('Начальное состояние', () => {
    test('Должен возвращать начальное состояние по умолчанию', () => {
      expect(feed(undefined, { type: 'unknown' })).toEqual(initialState);
    });
  });

  describe ('Асинхронные экшены:', () => {
    describe('getFeedsThunk', () => {
      test('Должен устанавливать isFeedsLoading в true при pending', () => {
        const action = { type: getFeedsThunk.pending.type };
        const state = feed(initialState, action);
        expect(state.isFeedsLoading).toBe(true);
        expect(state.error).toBeNull();
      });

      test('Должен обновлять состояние при fulfilled', () => {
        const action = {
          type: getFeedsThunk.fulfilled.type,
          payload: mockFeedResponse
        };
        const state = feed(initialState, action);

        expect(state.isFeedsLoading).toBe(false);
        expect(state.orders).toEqual(mockFeedResponse.orders);
        expect(state.total).toBe(mockFeedResponse.total);
        expect(state.totalToday).toBe(mockFeedResponse.totalToday);
        expect(state.error).toBeNull();
      });

      test('Должен устанавливать ошибку при rejected', () => {
        const errorMessage = 'Ошибка загрузки ленты заказов';
        const action = {
          type: getFeedsThunk.rejected.type,
          error: { message: errorMessage }
        };
        const state = feed(initialState, action);

        expect(state.isFeedsLoading).toBe(false);
        expect(state.error).toBe(errorMessage);
      });
    });

    describe('getOrderByNumberThunk', () => {
      test('Должен устанавливать isOrderLoading в true при pending', () => {
        const action = { type: getOrderByNumberThunk.pending.type };
        const state = feed(initialState, action);
        expect(state.isOrderLoading).toBe(true);
        expect(state.error).toBeNull();
      });

      test('Должен сохранять заказ при fulfilled', () => {
        const action = {
          type: getOrderByNumberThunk.fulfilled.type,
          payload: mockOrderResponse
        };
        const state = feed(initialState, action);

        expect(state.isOrderLoading).toBe(false);
        expect(state.order).toEqual(mockOrder);
        expect(state.error).toBeNull();
      });

      test('Должен устанавливать ошибку при rejected', () => {
        const errorMessage = 'Ошибка загрузки заказа';
        const action = {
          type: getOrderByNumberThunk.rejected.type,
          error: { message: errorMessage }
        };
        const state = feed(initialState, action);

        expect(state.isOrderLoading).toBe(false);
        expect(state.error).toBe(errorMessage);
      });
    });
  });
});

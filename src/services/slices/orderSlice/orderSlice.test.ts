import order, { orderBurgerThunk, clearOrder } from './orderSlice';
import { TOrder } from '../../../utils/types';

describe('Редьюсер заказов', () => {
  const initialState = {
    order: null,
    isOrderLoading: false,
    error: null
  };

  const mockOrder: TOrder = {
    _id: '643d69a5c3f7b9001cfa093c',
    ingredients: ['60d3b41abdacab0026a733c6', '60d3b41abdacab0026a733cc'],
    status: 'done',
    name: 'Space флюоресцентный бургер',
    createdAt: '2023-05-25T12:00:00.000Z',
    updatedAt: '2023-05-25T12:00:00.000Z',
    number: 12345
  };

  const mockOrderResponse = {
    order: mockOrder
  };

  describe('Начальное состояние', () => {
    test('Должен возвращать начальное состояние по умолчанию', () => {
      expect(order(undefined, { type: 'unknown' })).toEqual(initialState);
    });
  });

  describe('Синхронные экшены', () => {
    test('clearOrder должен очищать заказ и сбрасывать статус загрузки', () => {
      const stateWithOrder = {
        ...initialState,
        order: mockOrder,
        isOrderLoading: true
      };

      const state = order(stateWithOrder, clearOrder());

      expect(state.order).toBeNull();
      expect(state.isOrderLoading).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  describe('Асинхронные экшены:', () => {
    describe('orderBurgerThunk', () => {
      test('Должен устанавливать isOrderLoading в true при pending', () => {
        const action = { type: orderBurgerThunk.pending.type };
        const state = order(initialState, action);

        expect(state.isOrderLoading).toBe(true);
        expect(state.order).toBeNull();
        expect(state.error).toBeNull();
      });

      test('Должен сохранять заказ и сбрасывать загрузку при fulfilled', () => {
        const action = {
          type: orderBurgerThunk.fulfilled.type,
          payload: mockOrderResponse
        };
        const state = order(initialState, action);

        expect(state.isOrderLoading).toBe(false);
        expect(state.order).toEqual(mockOrder);
        expect(state.error).toBeNull();
      });

      test('Должен устанавливать ошибку и сбрасывать загрузку при rejected', () => {
        const errorMessage = 'Ошибка создания заказа';
        const action = {
          type: orderBurgerThunk.rejected.type,
          error: { message: errorMessage }
        };
        const state = order(initialState, action);

        expect(state.isOrderLoading).toBe(false);
        expect(state.error).toBe(errorMessage);
        expect(state.order).toBeNull();
      });
    });
  })
});

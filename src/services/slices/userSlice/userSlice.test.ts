import user, {
  loginUserThunk,
  logoutUserThunk,
  getUserThunk,
  registerUserThunk,
  updateUserThunk,
  getOrdersThunk,
  clearErrors
} from './userSlice';
import { TOrder, TUser } from '../../../utils/types';

describe('Редьюсер пользователя', () => {
  const initialState = {
    isAuthenticated: false,
    loginUserRequest: false,
    user: null,
    orders: [],
    ordersRequest: false,
    error: null
  };

  const mockUser: TUser = {
    name: 'Test User',
    email: 'test@example.com'
  };

  const mockOrders: TOrder[] = [
    {
      _id: '1',
      ingredients: ['60d3b41abdacab0026a733c6', '60d3b41abdacab0026a733cc'],
      status: 'done',
      name: 'Space флюоресцентный бургер',
      createdAt: '2023-05-25T12:00:00.000Z',
      updatedAt: '2023-05-25T12:00:00.000Z',
      number: 12345
    }
  ];

  describe('Начальное состояние', () => {
    test('Должен возвращать начальное состояние по умолчанию', () => {
      expect(user(undefined, { type: 'unknown' })).toEqual(initialState);
    });
  });

  describe('Синхронные экшены', () => {
    test('clearErrors должен очищать ошибку', () => {
      const stateWithError = {
        ...initialState,
        error: 'Test error'
      };

      const state = user(stateWithError, clearErrors());

      expect(state.error).toBeNull();
    });
  });

  describe('Асинхронные экшены', () => {
    describe('loginUserThunk', () => {
      test('Должен устанавливать флаги при pending', () => {
        const action = { type: loginUserThunk.pending.type };
        const state = user(initialState, action);

        expect(state.loginUserRequest).toBe(true);
        expect(state.error).toBeNull();
      });

      test('Должен сохранять пользователя и устанавливать флаги при fulfilled', () => {
        const action = {
          type: loginUserThunk.fulfilled.type,
          payload: mockUser
        };
        const state = user(initialState, action);

        expect(state.user).toEqual(mockUser);
        expect(state.loginUserRequest).toBe(false);
        expect(state.isAuthenticated).toBe(true);
        expect(state.error).toBeNull();
      });

      test('Должен устанавливать ошибку при rejected', () => {
        const errorMessage = 'Ошибка входа';
        const action = {
          type: loginUserThunk.rejected.type,
          error: { message: errorMessage }
        };
        const state = user(initialState, action);

        expect(state.loginUserRequest).toBe(false);
        expect(state.error).toBe(errorMessage);
      });
    });

    describe('logoutUserThunk', () => {
      test('Должен сбрасывать состояние пользователя при pending', () => {
        const stateWithUser = {
          ...initialState,
          user: mockUser,
          isAuthenticated: true
        };

        const action = { type: logoutUserThunk.pending.type };
        const state = user(stateWithUser, action);

        expect(state.user).toBeNull();
        expect(state.isAuthenticated).toBe(false);
        expect(state.loginUserRequest).toBe(false);
      });
    });

    describe('getUserThunk', () => {
      test('Должен устанавливать флаги при pending', () => {
        const action = { type: getUserThunk.pending.type };
        const state = user(initialState, action);

        expect(state.loginUserRequest).toBe(true);
      });

      test('Должен сохранять пользователя при fulfilled', () => {
        const action = {
          type: getUserThunk.fulfilled.type,
          payload: { user: mockUser }
        };
        const state = user(initialState, action);

        expect(state.user).toEqual(mockUser);
        expect(state.loginUserRequest).toBe(false);
        expect(state.isAuthenticated).toBe(true);
      });

      test('Должен сбрасывать пользователя при rejected', () => {
        const errorMessage = 'Ошибка получения данных';
        const stateWithUser = {
          ...initialState,
          user: mockUser,
          isAuthenticated: true
        };

        const action = {
          type: getUserThunk.rejected.type,
          error: { message: errorMessage }
        };
        const state = user(stateWithUser, action);

        expect(state.user).toBeNull();
        expect(state.loginUserRequest).toBe(false);
        expect(state.error).toBe(errorMessage);
      });
    });

    describe('registerUserThunk', () => {
      test('Должен устанавливать флаги при pending', () => {
        const action = { type: registerUserThunk.pending.type };
        const state = user(initialState, action);

        expect(state.loginUserRequest).toBe(true);
        expect(state.isAuthenticated).toBe(false);
      });

      test('Должен сохранять пользователя при fulfilled', () => {
        const action = {
          type: registerUserThunk.fulfilled.type,
          payload: mockUser
        };
        const state = user(initialState, action);

        expect(state.user).toEqual(mockUser);
        expect(state.loginUserRequest).toBe(false);
        expect(state.isAuthenticated).toBe(true);
      });

      test('Должен устанавливать ошибку при rejected', () => {
        const errorMessage = 'Ошибка регистрации';
        const action = {
          type: registerUserThunk.rejected.type,
          error: { message: errorMessage }
        };
        const state = user(initialState, action);

        expect(state.loginUserRequest).toBe(false);
        expect(state.isAuthenticated).toBe(false);
        expect(state.error).toBe(errorMessage);
      });
    });

    describe('updateUserThunk', () => {
      test('Должен устанавливать флаги при pending', () => {
        const action = { type: updateUserThunk.pending.type };
        const state = user(initialState, action);

        expect(state.loginUserRequest).toBe(true);
      });

      test('Должен обновлять пользователя при fulfilled', () => {
        const updatedUser = { ...mockUser, name: 'Updated Name' };
        const action = {
          type: updateUserThunk.fulfilled.type,
          payload: { user: updatedUser }
        };
        const state = user({ ...initialState, user: mockUser }, action);

        expect(state.user).toEqual(updatedUser);
        expect(state.loginUserRequest).toBe(false);
        expect(state.isAuthenticated).toBe(true);
      });

      test('Должен устанавливать ошибку при rejected', () => {
        const errorMessage = 'Ошибка обновления';
        const action = {
          type: updateUserThunk.rejected.type,
          error: { message: errorMessage }
        };
        const state = user(initialState, action);

        expect(state.loginUserRequest).toBe(false);
        expect(state.error).toBe(errorMessage);
      });
    });

    describe('getOrdersThunk', () => {
      test('Должен устанавливать флаги при pending', () => {
        const action = { type: getOrdersThunk.pending.type };
        const state = user(initialState, action);

        expect(state.ordersRequest).toBe(true);
      });

      test('Должен сохранять заказы при fulfilled', () => {
        const action = {
          type: getOrdersThunk.fulfilled.type,
          payload: mockOrders
        };
        const state = user(initialState, action);

        expect(state.orders).toEqual(mockOrders);
        expect(state.ordersRequest).toBe(false);
      });

      test('Должен устанавливать ошибку при rejected', () => {
        const errorMessage = 'Ошибка получения заказов';
        const action = {
          type: getOrdersThunk.rejected.type,
          error: { message: errorMessage }
        };
        const state = user(initialState, action);

        expect(state.ordersRequest).toBe(false);
        expect(state.error).toBe(errorMessage);
      });
    });
  });
});

import ingredients, { getIngredientsThunk } from './ingredientsSlice';
import { TIngredient } from '../../../utils/types';

describe('Редьюсер ингредиентов', () => {
  const initialState = {
    ingredients: [],
    isIngredientsLoading: false,
    error: null
  };

  const mockIngredients: TIngredient[] = [
    {
      _id: '60d3b41abdacab0026a733c6',
      name: 'Краторная булка N-200i',
      type: 'bun',
      proteins: 80,
      fat: 24,
      carbohydrates: 53,
      calories: 420,
      price: 1255,
      image: 'https://code.s3.yandex.net/react/code/bun-02.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
    },
    {
      _id: '60d3b41abdacab0026a733cc',
      name: 'Соус Spicy-X',
      type: 'main',
      proteins: 30,
      fat: 20,
      carbohydrates: 40,
      calories: 30,
      price: 90,
      image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png'
    }
  ];

  describe('Начальное состояние', () => {
    test('Должен возвращать начальное состояние по умолчанию', () => {
      expect(ingredients(undefined, { type: 'unknown' })).toEqual(initialState);
    });
  });
  describe('Асинхронные экшены:', () => {
    describe('getIngredientsThunk', () => {
      test('Должен устанавливать isIngredientsLoading в true при pending', () => {
        const action = { type: getIngredientsThunk.pending.type };
        const state = ingredients(initialState, action);

        expect(state.isIngredientsLoading).toBe(true);
        expect(state.error).toBeNull();
        expect(state.ingredients).toEqual([]);
      });

      test('Должен сохранять ингредиенты и сбрасывать загрузку при fulfilled', () => {
        const action = {
          type: getIngredientsThunk.fulfilled.type,
          payload: mockIngredients
        };
        const state = ingredients(initialState, action);

        expect(state.isIngredientsLoading).toBe(false);
        expect(state.ingredients).toEqual(mockIngredients);
        expect(state.error).toBeNull();
      });

      test('Должен устанавливать ошибку и сбрасывать загрузку при rejected', () => {
        const errorMessage = 'Ошибка загрузки ингредиентов';
        const action = {
          type: getIngredientsThunk.rejected.type,
          error: { message: errorMessage }
        };
        const state = ingredients(initialState, action);

        expect(state.isIngredientsLoading).toBe(false);
        expect(state.error).toBe(errorMessage);
        expect(state.ingredients).toEqual([]);
      });
    });
  })
});

import {
  addIngredient,
  upIngredient,
  downIngredient,
  removeIngredient,
  clearBurgerConstructor
} from './burgerConstructorSlice';
import burgerConstructor from './burgerConstructorSlice';
import { TIngredient } from '../../../utils/types';

describe('Редьюсер конструктора бургера', () => {
  const initialState = {
    burgerConstructor: {
      bun: null,
      ingredients: []
    },
    error: null
  };

  const mockBun: TIngredient = {
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
  };

  const mockMain: TIngredient = {
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
  };

  describe('Начальное состояние', () => {
    test('Должен возвращать начальное состояние по умолчанию', () => {
      expect(burgerConstructor(undefined, { type: 'unknown' })).toEqual(
        initialState
      );
    });
  });

  describe('Добавление ингредиентов', () => {
    test('Должен добавлять булку в конструктор, когда тип ингредиента - bun', () => {
      const action = addIngredient(mockBun);
      const result = burgerConstructor(initialState, action);

      expect(result.burgerConstructor.bun).toEqual({
        ...mockBun,
        id: expect.any(String)
      });
      expect(result.burgerConstructor.ingredients).toHaveLength(0);
    });

    test('Должен добавлять ингредиент в массив ingredients, когда тип не bun', () => {
      const action = addIngredient(mockMain);
      const result = burgerConstructor(initialState, action);

      expect(result.burgerConstructor.bun).toBeNull();
      expect(result.burgerConstructor.ingredients).toEqual([
        {
          ...mockMain,
          id: expect.any(String)
        }
      ]);
    });
  });

  describe('Удаление ингредиентов', () => {
    test('Должен удалять ингредиент из массива ingredients по id', () => {
      const addAction = addIngredient(mockMain);
      const stateWithIngredient = burgerConstructor(initialState, addAction);
      const ingredientToRemove =
        stateWithIngredient.burgerConstructor.ingredients[0];
      const removeAction = removeIngredient(ingredientToRemove);
      const result = burgerConstructor(stateWithIngredient, removeAction);

      expect(result.burgerConstructor.ingredients).toHaveLength(0);
    });

    test('Не должен изменять состояние при попытке удалить несуществующий ингредиент', () => {
      const nonExistentIngredient = { ...mockMain, id: 'non-existent-id' };
      const action = removeIngredient(nonExistentIngredient);
      const result = burgerConstructor(initialState, action);

      expect(result).toEqual(initialState);
    });
  });

  describe('Изменение порядка ингредиентов', () => {
    const firstIngredient = { ...mockMain, id: '1' };
    const secondIngredient = { ...mockMain, id: '2' };
    const stateWithIngredients = {
      ...initialState,
      burgerConstructor: {
        ...initialState.burgerConstructor,
        ingredients: [firstIngredient, secondIngredient]
      }
    };

    test('Должен перемещать ингредиент вверх в списке при вызове upIngredient', () => {
      const action = upIngredient(1);
      const result = burgerConstructor(stateWithIngredients, action);

      expect(result.burgerConstructor.ingredients).toEqual([
        secondIngredient,
        firstIngredient
      ]);
    });

    test('Должен перемещать ингредиент вниз в списке при вызове downIngredient', () => {
      const action = downIngredient(0);
      const result = burgerConstructor(stateWithIngredients, action);

      expect(result.burgerConstructor.ingredients).toEqual([
        secondIngredient,
        firstIngredient
      ]);
    });

    test('Не должен изменять порядок при попытке переместить первый элемент вверх', () => {
      const action = upIngredient(0);
      const result = burgerConstructor(stateWithIngredients, action);

      expect(result.burgerConstructor.ingredients).toEqual([
        firstIngredient,
        secondIngredient
      ]);
    });

    test('Не должен изменять порядок при попытке переместить последний элемент вниз', () => {
      const action = downIngredient(1);
      const result = burgerConstructor(stateWithIngredients, action);

      expect(result.burgerConstructor.ingredients).toEqual([
        firstIngredient,
        secondIngredient
      ]);
    });
  });

  describe('Очистка конструктора', () => {
    test('Должен полностью очищать конструктор бургера', () => {
      const stateWithIngredients = {
        ...initialState,
        burgerConstructor: {
          bun: { ...mockBun, id: 'bun-id' },
          ingredients: [
            { ...mockMain, id: '1' },
            { ...mockMain, id: '2' }
          ]
        }
      };

      const result = burgerConstructor(
        stateWithIngredients,
        clearBurgerConstructor()
      );

      expect(result.burgerConstructor.bun).toBeNull();
      expect(result.burgerConstructor.ingredients).toHaveLength(0);
    });
  });
});

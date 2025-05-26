import store, { rootReducer } from './store';

test('проверка работы rootReducer', () => {
  const expected = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
  expect(expected).toEqual(store.getState());
});

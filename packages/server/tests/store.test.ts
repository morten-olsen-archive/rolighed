import createStore from '../src';

describe('server/store', () => {
  it('should be able to create an empty store', async () => {
    const store = await createStore({
      plugins: {},
    });
    expect(store.getState()).toEqual({
      accessories: {},
      accessoryStates: {},
      deviceGroups: {},
      deviceStates: {},
      devices: {},
      groupSettings: {},
    });
  });
});

import { Script, ScriptConfig, createDefaultState, GroupsState } from '@morten-olsen/rolighed-common';
import createStore, { scripts } from '../src';

const setup = async (config: {[name: string]: ScriptConfig}, initialState: GroupsState) => {
  const store = await createStore({
    initialState,
    plugins: {
      scripts: {
        pkg: scripts,
        config,
      }
    }
  });

  return { store };
};

const createScript1 = () => {
  const fn = jest.fn();
  let _dispatch: any;
  let _getState: any;
  const script: Script = (_, { getState, dispatch }) => {
    _dispatch = dispatch;
    _getState = getState;
    return async (action) => {
      fn(action);
    };
  };

  return {
    fn,
    script,
    getDispatch: () => _dispatch,
    getGetState: () => _getState,
  };
};

describe('server/scripts', () => {
  it('should be able to run script', async () => {
    const { fn, script, getDispatch, getGetState } = createScript1();
    const { store } = await setup({
      test: {
        pkg: script,
        config: {},
      },
    }, {
      ...createDefaultState(),
    });
    const dispatch = getDispatch();
    const getState = getGetState();
    expect(fn).toHaveBeenCalledTimes(0);
    await Promise.resolve(store.dispatch({
      type: 'test1',
    }));
    expect(fn).toHaveBeenNthCalledWith(1, { type: 'test1' })
    await Promise.resolve(dispatch({ type: 'test2' }));
    expect(fn).toHaveBeenNthCalledWith(2, { type: 'test2' })
    expect(getState()).toEqual(store.getState());
  });
});

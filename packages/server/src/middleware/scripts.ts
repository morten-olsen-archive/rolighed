import { Middleware } from 'redux';
import { Script } from '@morten-olsen/rolighed-common';
import createActions from '../actions/scripts';

const createScripts = (scripts: Script[]): Middleware => (store) => (next) => {
  const actions = createActions(store);
  const scriptList = scripts.map((script) => script({
    dispatch: store.dispatch,
    getState: store.getState,
    actions,
  }));
  return async (action: any) => {
    const result = await Promise.resolve(next(action));
    await Promise.all(scriptList.map((script) => script(action)));

    return result;
  };
};

export default createScripts;

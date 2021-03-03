import { Middleware } from 'redux';
import Script from '../types/Script';
import createActions from '../actions/scripts';

const createScripts = (scripts: ReturnType<Script>[]): Middleware => (store) => (next) => {
  const actions = createActions(store);
  const scriptList = scripts.map((script) => script({
    dispatch: store.dispatch,
    getState: store.getState,
    actions,
  }));
  return async (action: any) => {
    const hrstart = process.hrtime()
    const scriptStats = await Promise.all(scriptList.map(async (script) => {
      const scriptstart = process.hrtime()
      await script(action);
      const scriptend = process.hrtime(scriptstart);
      return {
        s: scriptend[0],
        ms: scriptend[1] / 1000000,
      };
    }));
    const hrend = process.hrtime(hrstart)

    return next({
      ...action,
      stats: {
        ...(action.stats || {}),
        scriptTime: {
          s: hrend[0],
          ms: hrend[1] / 1000000,
        },
        scripts: scriptStats,
      },
    });
  };
};

export default createScripts;

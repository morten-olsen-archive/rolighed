import { Middleware, ScriptConfig, Script } from '@morten-olsen/rolighed-common';

interface Options {
  [name: string]: ScriptConfig;
}

const createScripts: Middleware<Options> = async (scripts) => (store) => (next) => {
  const scriptList = Object.entries(scripts).map(([_, definition]) => {
      let script: Script;
      if (typeof definition.pkg === 'string') {
        const pkg = require(definition.pkg);
        script = pkg.default || pkg;
      } else {
        script = definition.pkg;
      }
      return script(definition.config, {
        dispatch: store.dispatch,
        getState: store.getState,
      });
  });
  return async (action: any) => {
    const result = await Promise.resolve(next(action));
    await Promise.all(scriptList.map((script) => script(action)));

    return result;
  };
};

export default createScripts;

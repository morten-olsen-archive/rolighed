import { Dispatch } from 'redux';

interface ScriptArgs {
  dispatch: Dispatch,
  getState: () => any;
}

type Script<Config = any> = (config: Config, args: ScriptArgs) => (action: any) => Promise<void>;

export {
  ScriptArgs,
};

export default Script;

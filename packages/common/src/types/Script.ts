import { Dispatch } from 'redux';
import createActions from '../actions/scripts';

interface ScriptArgs {
  dispatch: Dispatch,
  getState: () => any;
  actions: ReturnType<typeof createActions>;
}

type Script<Options = any> = (options: Options) => (args: ScriptArgs) => (action: any) => Promise<void>;

export {
  ScriptArgs,
};

export default Script;

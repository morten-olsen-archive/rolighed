import { Middleware as ReduxMiddleware } from 'redux';
import GroupsState from './GroupState';

type Middleware<Config = any> = (config: Config) => Promise<ReduxMiddleware<GroupsState>>;

export default Middleware;

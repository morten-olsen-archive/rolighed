import Middleware from './Middleware';

interface MiddlewareConfig<Config = any> {
  pkg: string | Middleware;
  config: Config;
}

export default MiddlewareConfig;

import Middleware from './Middleware';

interface MiddlewareConfig<Config = any> {
  pkg: string | Middleware<Config>;
  config: Config;
}

export default MiddlewareConfig;

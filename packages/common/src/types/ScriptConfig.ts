import Script from './Script';

interface ScriptConfig<Config = any> {
  pkg: string | Script;
  config: Config;
}

export default ScriptConfig;

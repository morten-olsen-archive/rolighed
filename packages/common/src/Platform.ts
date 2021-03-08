import PlatformApi from './types/PlatformApi';

abstract class Platform<Config = any, State = any> {
  private _api: PlatformApi;

  constructor(api: PlatformApi) {
    this._api = api;
  }

  get api() {
    return this._api;
  }

  abstract setup: (config: Config) => Promise<void>;

  abstract onSetDeviceState: (name: string, state: State) => Promise<void>;
}

export default Platform;

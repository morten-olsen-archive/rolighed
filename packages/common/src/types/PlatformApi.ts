interface PlatformApi {
  addDevice: (name: string, config: any, state: any) => Promise<any>;
  setDevice: (name: string, state?: any, config?: any) => Promise<any>;
  removeDevice: (name: string) => Promise<any>;
}

export default PlatformApi;

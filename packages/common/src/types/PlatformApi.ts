interface PlatformApi {
  setDevice: (name: string, state?: any, config?: any) => Promise<any>;
  removeDevice: (name: string) => Promise<any>;
}

export default PlatformApi;

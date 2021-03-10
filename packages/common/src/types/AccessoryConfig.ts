interface AccessoryConfig {
  type: string,
  bind: {
    [prop: string]: string;
  }
}

export default AccessoryConfig;

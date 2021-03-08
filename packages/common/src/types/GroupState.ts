interface GroupsState {
  devices: {
    [deviceName: string]: {
      controller: string;
      config: any;
    }
  };
  deviceStates: {
    [deviceName: string]: {
      [key: string]: any;
    };
  };
  deviceGroups: {
    [deviceName: string]: string[];
  };
  groupSettings: {
    [groupName: string]: {
      [key: string]: any;
    };
  };
  accessories: {
    [name: string]: {
      type: string;
      bind: {
        [prop: string]: string;
      };
    };
  };
  accessoryStates: {
    [name: string]: {
      [key: string]: any;
    };
  };
}

export default GroupsState;

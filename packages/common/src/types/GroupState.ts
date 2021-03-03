interface GroupsState {
  devices: {
    [deviceName: string]: string[];
  };
  settings: {
    [groupName: string]: {
      [key: string]: any;
    };
  };
  deviceStates: {
    [deviceName: string]: {
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
  };
}

export default GroupsState;

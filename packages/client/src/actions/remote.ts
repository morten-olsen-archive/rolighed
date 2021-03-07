const remote = (payload: any) => ({
  type: '@@SOCKET/remote',
  payload,
});

export {
  remote,
};

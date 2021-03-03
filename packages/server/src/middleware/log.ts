import { Middleware } from 'redux';

const create = (): Middleware => (store) => (next) => async (action) => {
  const hrstart = process.hrtime()
  const result = await next(action);
  const hrend = process.hrtime(hrstart)
  console.info('Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000)

  return result;
};

export default create;

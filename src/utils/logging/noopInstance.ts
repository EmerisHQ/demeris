import noop from 'lodash.noop';

const emptyObj = {};
const handler = {
  get() {
    return noop;
  },
};
export const noopInstance = new Proxy(emptyObj, handler);

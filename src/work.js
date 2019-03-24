const symbol = Symbol('FiberizeWork');

let id = 0;

export function createWork(fiber) {
  return {
    $$type: symbol,
    label: id++, /* for debugging */
    fiber,
    wait: false,
    returnLink: null, /* to work who ran me */
    slot: null, /* for receiving return value */
  };
}

export function isWork(maybeWork) {
  return maybeWork && maybeWork.$$type === symbol;
}

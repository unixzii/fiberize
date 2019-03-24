import * as scheduler from './scheduler';

export { default as run } from './run';
export const execute = scheduler.execute;
export const executeUntilDeadline = scheduler.executeUntilDeadline;

export function executeWhileIdle() {
  if (!executeUntilDeadline(Date.now() + 10)) {
    // can't use `process.nextTick` here, it will run before
    // any I/O and timers.
    setTimeout(executeWhileIdle, 0);
  }
}

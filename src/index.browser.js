import * as scheduler from './scheduler';

export { default as run } from './run';
export const execute = scheduler.execute;
export const executeUntilDeadline = scheduler.executeUntilDeadline;

export function executeWhileIdle() {
  window.requestIdleCallback(function (deadline) {
    if (!executeUntilDeadline(Date.now() + deadline.timeRemaining())) {
      executeWhileIdle();
    }
  });
}

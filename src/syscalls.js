import { internalRun } from './run';
import { currentWork } from './scheduler';
import { isGenerator } from './utils';

function handleRun(syscall) {
  let work;

  if (isGenerator(syscall)) {
    work = internalRun(syscall);
  } else {
    // TODO:
  }

  // put the current work into wait state, and let the new
  // work signal it.
  const _currentWork = currentWork();
  work.returnLink = _currentWork;
  _currentWork.wait = true;
}

export function handleSyscall(syscall) {
  if (isGenerator(syscall)) {
    // syntactic sugar for `run`.
    handleRun(syscall);
  }

  // TODO:
}

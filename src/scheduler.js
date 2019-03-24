import invariant from 'invariant';
import { handleSyscall } from './syscalls';

const FOREVER = 0;
const SINGLE_STEP = 1;

const q = {
  next: null,
  prev: null,
  work: null
};

let qTail = q;
let current = q;

export function enqueue(work) {
  const newTail = {
    next: null,
    prev: qTail,
    work
  };

  qTail.next = newTail;
  qTail = newTail;
}

function doWork(work) {
  const currentFiber = work.fiber;
  const { value: syscall, done } = currentFiber.next(work.slot);
  work.slot = null;

  invariant(syscall !== null || done, 'Program should yield with a syscall.');
  
  if (done) {
    // handle the return link.
    if (work.returnLink) {
      work.returnLink.slot = syscall /* as "return value" */;
      // wake up.
      work.returnLink.wait = false;
    }
  } else if (syscall) {
    handleSyscall(syscall);
  }

  return done;
}

function workLoop(deadline) {
  while (q.next) {
    if (!current) {
      // current is after the tail, reset it to the first valid item.
      current = q.next;
    }

    if (!current.work) {
      // TODO: support barriers.
      current = current.next;
    }

    // FIXME: can cause one useless loop when last work produced a
    // new work, we may improve this.
    const nextCurrent = current.next;

    const currentWork = current.work;
    if (currentWork.wait) {
      // work is not ready, do nothing.
    } else {
      if (doWork(currentWork)) {
        // work is done, remove it from the queue.
        if (current === qTail) {
          qTail = current.prev;
        }
        if (current.next) {
          current.next.prev = current.prev;
        }
        if (current.prev) {
          current.prev.next = current.next;
        }
        current.next = null;
        current.prev = null;
        current.work = null;
      }
    }

    current = nextCurrent;

    // hand over the control if timeout.
    if (deadline === SINGLE_STEP) {
      break;
    } else if (deadline > 0 && Date.now() >= deadline) {
      break;
    }
  }

  return q.next === null;
}

export function currentWork() {
  return current.work;
}

export function execute() {
  return workLoop(FOREVER);
}

export function stepOnce() {
  return workLoop(SINGLE_STEP);
}

export function executeUntilDeadline(deadline) {
  return workLoop(deadline);
}

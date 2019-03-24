import invariant from 'invariant';
import { createWork } from './work';
import { enqueue } from './scheduler';
import { isGenerator } from './utils';

export function internalRun(fiber) {
  if (!isGenerator(fiber)) {
    invariant(false, 'You must call `run` with a generator.');
    return;
  }

  const work = createWork(fiber);
  enqueue(work);
  return work;
}

export default function run(fiber) {
  internalRun(fiber);
}

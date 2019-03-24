const { run, executeWhileIdle } = require('./lib/fiberize.cjs');

function* fib(n) {
  if (n <= 2) {
    return 1;
  }

  return (yield fib(n - 1)) + (yield fib(n - 2));
}

function* main() {
  for (let i = 1; i < 40; i++) {
    const res = yield fib(i);
    console.log(res);
  }
}

run(main());
executeWhileIdle();

console.log('Back to main.');
setInterval(function () {
  console.log('Main loop is still alive!!');
}, 1000);

export function isGenerator(a) {
  // a naive way to check if something is a generator.
  return a.toString() === '[object Generator]' && a.next instanceof Function;
}

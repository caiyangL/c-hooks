export function depsAreSame(a, b) {
    if (a === b) return true;
    return a.every((item, i) => item === b[i]);
}

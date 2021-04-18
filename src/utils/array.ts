export function difference<T>(
  arr1: readonly T[],
  arr2: readonly T[],
): readonly T[] {
  return [arr1, arr2].reduce((a, b) => a.filter((c) => !b.includes(c)))
}

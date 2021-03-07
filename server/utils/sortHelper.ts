export function determineSortAdjustedPositions<T>(
  previousPosition: number,
  newPosition: number,
  items: T[],
  sortBy: (value: T) => number
): [T, number][] {
  if (newPosition < previousPosition) {
    return items.map<[T, number]>(item => [item, sortBy(item)]).filter(([_item, position]) => (
      position >= newPosition && position < previousPosition
    )).map(([item, position]) => [item, position + 1]);
  } else if (newPosition > previousPosition) {
    return items.map<[T, number]>(item => [item, sortBy(item)]).filter(([_item, position]) => (
      position > previousPosition && position <= newPosition
    )).map(([item, position]) => [item, position - 1]);
  }

  return [];
}

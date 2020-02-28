export function getAttackType(type: 0 | 1 | 2) {
  switch (type) {
    case 0: return 'Physical';
    case 1: return 'Special';
    case 2: return 'Status';
  }
}
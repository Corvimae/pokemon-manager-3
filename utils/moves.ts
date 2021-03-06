export function getAttackType(type: string) {
  switch (type) {
    case 'physical': return 'Physical';
    case 'special': return 'Special';
    case 'status': return 'Status';
    case 'static': return 'Static';
    default: return '(Invalid)'
  }
}
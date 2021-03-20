export const DAMAGE_BASE = {
  1: {
    dieCount: 1,
    dieSides: 6,
    bonus: 1,
  },
  2: {
    dieCount: 1,
    dieSides: 6,
    bonus: 3,
  },
  3: {
    dieCount: 1,
    dieSides: 6,
    bonus: 1,
  },
  4: {
    dieCount: 1,
    dieSides: 8,
    bonus: 6,
  },
  5: {
    dieCount: 1,
    dieSides: 8,
    bonus: 8,
  },
  6: {
    dieCount: 2,
    dieSides: 6,
    bonus: 8,
  },
  7: {
    dieCount: 2,
    dieSides: 6,
    bonus: 10,
  },
  8: {
    dieCount: 2,
    dieSides: 8,
    bonus: 10,
  },
  9: {
    dieCount: 3,
    dieSides: 8,
    bonus: 10
  },
  10: {
    dieCount: 3,
    dieSides: 8,
    bonus: 10,
  },
  11: {
    dieCount: 3,
    dieSides: 10,
    bonus: 10,
  },
  12: {
    dieCount: 3,
    dieSides: 12,
    bonus: 10,
  },
  13: {
    dieCount: 4,
    dieSides: 10,
    bonus: 10,
  },
  14: {
    dieCount: 4,
    dieSides: 10,
    bonus: 15,
  },
  15: {
    dieCount: 4,
    dieSides: 10,
    bonus: 20,
  },
  16: {
    dieCount: 5,
    dieSides: 10,
    bonus: 20,
  },
  17: {
    dieCount: 5,
    dieSides: 12,
    bonus: 25,
  },
  18: {
    dieCount: 6,
    dieSides: 12,
    bonus: 25,
  },
  19: {
    dieCount: 6,
    dieSides: 12,
    bonus: 30,
  },
  20: {
    dieCount: 6,
    dieSides: 12,
    bonus: 35,
  },
  21: {
    dieCount: 6,
    dieSides: 12,
    bonus: 40,
  },
  22: {
    dieCount: 6,
    dieSides: 12,
    bonus: 45,
  },
  23: {
    dieCount: 6,
    dieSides: 12,
    bonus: 50,
  },
  24: {
    dieCount: 6,
    dieSides: 12,
    bonus: 55,
  },
  25: {
    dieCount: 6,
    dieSides: 12,
    bonus: 60,
  },
  26: {
    dieCount: 7,
    dieSides: 12,
    bonus: 65,
  },
  27: {
    dieCount: 8,
    dieSides: 12,
    bonus: 70,
  },
  28: {
    dieCount: 8,
    dieSides: 12,
    bonus: 80,
  },
};

export function getAttackType(type: string) {
  switch (type) {
    case 'physical': return 'Physical';
    case 'special': return 'Special';
    case 'status': return 'Status';
    case 'static': return 'Static';
    default: return '(Invalid)'
  }
}

export function getDiceRoll(damageBase: number) {
  const { dieCount, dieSides, bonus } = DAMAGE_BASE[damageBase] ?? {};

  return `${dieCount}d${dieSides} + ${bonus}`;
}


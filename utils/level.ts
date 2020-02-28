export const LEVEL_THRESHOLDS = [
  0, 25, 50, 100, 150,
  200, 400, 600, 800, 1000,
  1500, 2000, 3000, 4000, 5000,
  6000, 7000, 8000, 9000, 10000,
  11500, 13000, 14500, 16000, 17500,
  19000, 20500, 22000, 23500, 25000,
  27500, 30000, 32500, 35000, 37500,
  40000, 42500, 45000, 47500, 50000,
  55000, 60000, 65000, 70000, 75000,
  80000, 85000, 90000, 95000, 100000,
  110000, 120000, 130000, 140000, 150000,
  160000, 170000, 180000, 190000, 200000,
  210000, 220000, 230000, 240000, 250000,
  260000, 270000, 280000, 290000, 300000,
  310000, 320000, 330000, 340000, 350000,
  360000, 370000, 380000, 390000, 400000,
  410000, 420000, 430000, 440000, 450000,
  460000, 470000, 480000, 490000, 500000,
  510000, 520000, 530000, 540000, 550000,
  560000, 570000, 580000, 590000, 600000
];

export function calculateLevel(experience: number) {
  const index = LEVEL_THRESHOLDS.findIndex(threshold => threshold > experience);

  return index === -1 ? 100 : index;
}

export function calculateExperienceToNextLevel(experience: number) {
  const level = calculateLevel(experience);

  return level === 100 ? '-' : LEVEL_THRESHOLDS[level] - experience;
}

export function calculatePercentageToNextLevel(experience: number) {
  const level = calculateLevel(experience);
  const toNext = calculateExperienceToNextLevel(experience);

  if(toNext === '-') return 100;

  const experienceBetweenLevels = LEVEL_THRESHOLDS[level] - LEVEL_THRESHOLDS[level - 1];

  return ((experienceBetweenLevels - toNext) / experienceBetweenLevels) * 100;
}
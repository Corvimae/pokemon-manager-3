export const LEVEL_THRESHOLDS = [
  0,     10,    20,    30,    40,    50,    60,    70,    80,    90,
  110,   135,   160,   190,   220,   250,   285,   320,   360,   400,
  460,   530,   600,   670,   745,   820,   900,   990,   1075,  1165,
  1260,  1355,  1455,  1555,  1660,  1770,  1880,  1995,  2110,  2230,
  2355,  2480,  2610,  2740,  2875,  3015,  3155,  3300,  3445,  3645,
  3850,  4060,  4270,  4485,  4705,  4930,  5160,  5390,  5625,  5865,
  6110,  6360,  6610,  6865,  7125,  7390,  7660,  7925,  8205,  8485,
  8770,  9060,  9350,  9645,  9945,  10250, 10560, 10870, 11185, 11505,
  11910, 12320, 12735, 13155, 13580, 14010, 14445, 14885, 15330, 15780,
  16235, 16695, 17160, 17630, 18105, 18585, 19070, 19560, 20055, 20555,
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